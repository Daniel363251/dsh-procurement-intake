import { defineTool } from '@deepseek-ai/dsh-tools'
import { createProcurementService } from './procurement-domain-service.js'
import { AI_MAX_FIELD_PREVIEW_ROWS, AI_COLOR_SCOPES, AI_COLOR_TOKENS, aiAllowedFields, aiFieldMetadata, aiOperatorsFor, aiComplete, aiParseJson, aiValidateRule } from './ai-generation.js'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  procurementDomain, requisitionLineSchema, purchaseOrderSchema, purchaseOrderItemSchema,
  supplierMasterSchema, materialMasterSchema, materialCategoryMasterSchema,
} from './schemas.js'
import { parseNcWorkbook, readFileBytes, fileBaseName, MAX_NC_FILE_BYTES } from './imports/parse-nc-workbook.js'
import {
  LIST_FIELD_TYPES, ORDER_FIELD_TYPES, FOLLOW_UP_FIELDS, nowIso, activity, listFieldValue,
  procurementOrgFromSource, filterListRows, sortListRows, orderFieldValue,
  purchaseOrderRequisitionNos, filterListKeywords,
} from './list-query.js'

function lineSummary(row) {
  return {
    id: row.id,
    requisitionNo: row.requisitionNo,
    procurementOrg: row.procurementOrg || procurementOrgFromSource(row),
    lineNo: row.lineNo,
    materialCode: row.materialCode,
    materialName: row.materialName,
    materialCategory: row.materialCategory,
    specification: row.specification,
    model: row.model,
    quantity: row.quantity,
    unit: row.unit,
    demandDate: row.demandDate,
    purchaseOrderNo: row.purchaseOrderNo,
    supplier: row.supplier,
    isMine: row.isMine,
    expectedShipAt: row.expectedShipAt || row.buyerEtaFromFile,
    orderStatus: row.orderStatus,
    nextAction: row.nextAction,
    waitingOn: row.waitingOn,
    needsReview: row.needsReview,
    reviewReason: row.reviewReason,
    confirmedAt: row.confirmedAt,
    sourceFileName: row.sourceFileName,
  }
}

function resultSchema() {
  return { type: 'object', additionalProperties: true }
}

function rowsRender(label, value) {
  return [{ type: 'text', text: `${label}：${value.count} 条明细` }]
}

// ---------------------------------------------------------------------------
// AI 生成：把自然语言指令转成结构化筛选/填色规则，或逐行计算 AI 字段。
// 契约与校验语义对齐 ai-table-plugin 的 AITableFilterRule / AITableColorRule。
// ---------------------------------------------------------------------------

class ProcurementService extends TypertRemoteService {
  static inject = ['storageDomain', 'tools', 'fs', 'llm', 'agentDefaultModel']

  constructor(ctx, config) {
    super(ctx, 'procurement')
    this.ctx = ctx
    this.service = null
    this.ready = ctx.storageDomain.open(procurementDomain)
    ctx.effect(() => async () => {
      const domain = await this.ready
      await domain.close()
    }, 'procurement: domain lifecycle')
    this.registerTools()
  }

  async getService() {
    const domain = await this.ready
    if (this.service === null) {
      this.service = createProcurementService(domain)
      try {
        const seeded = await this.service.seedMasterDataFromStoredImports()
        if (seeded.createdCount) this.ctx.logger.info(`[procurement] initialized ${seeded.createdCount} procurement master-data records`)
      } catch (error) {
        this.ctx.logger.warn(`[procurement] master-data initialization skipped: ${error instanceof Error ? error.message : String(error)}`)
      }
      try {
        const migrated = await this.service.migrateMaterialCategory()
        if (migrated) this.ctx.logger.info(`[procurement] backfilled materialCategory for ${migrated} rows`)
      } catch (error) {
        this.ctx.logger.warn(`[procurement] materialCategory backfill skipped: ${error instanceof Error ? error.message : String(error)}`)
      }
      try {
        const migrated = await this.service.migrateProcurementOrg()
        if (migrated) this.ctx.logger.info(`[procurement] backfilled procurementOrg for ${migrated} rows`)
      } catch (error) {
        this.ctx.logger.warn(`[procurement] procurementOrg backfill skipped: ${error instanceof Error ? error.message : String(error)}`)
      }
      try {
        const synced = await this.service.syncOwnedPurchaseOrderStatuses()
        if (synced.syncedLineCount) this.ctx.logger.info(`[procurement] synchronized purchase order status for ${synced.syncedLineCount} owned lines`)
      } catch (error) {
        this.ctx.logger.warn(`[procurement] purchase order status sync skipped: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    return this.service
  }

  registerTools() {
    const ctx = this.ctx
    ctx.tools.register(defineTool({
      name: 'procurement_list',
      description: '列出采购需求明细。status 为 pending（待筛选）、mine（我的需求）或 all（全部）。返回精简后的明细列表，供采购员或 Agent 了解当前需求和认领状态。',
      parameters: {
        status: { type: 'string', enum: ['pending', 'mine', 'all'], required: true, description: '要查看的集合：pending / mine / all。' },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => rowsRender('采购需求', value),
      },
      execute: async (args) => {
        const service = await this.getService()
        const rows = service.list(args.status)
        return { count: rows.length, rows: rows.map(lineSummary) }
      },
      presentCall: (args) => ({ card: 'generic', title: '查看采购需求', kind: 'other', rawInput: args.status }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_search',
      description: '按物料名称关键词搜索采购需求明细（多词任一命中，可用空格/逗号/分号/竖线分隔）。空关键词返回全部。返回命中的明细及其请购单信息。',
      parameters: {
        keywords: { type: 'string', required: true, description: '物料名称关键词；多个词用空格、逗号、分号或竖线分隔，任一命中。' },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => rowsRender('命中明细', value),
      },
      execute: async (args) => {
        const service = await this.getService()
        const rows = service.search(args.keywords)
        return { count: rows.length, rows: rows.map(lineSummary) }
      },
      presentCall: (args) => ({ card: 'generic', title: '搜索采购需求', kind: 'other', rawInput: args.keywords }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_claim',
      description: '将选中的待筛选明细批量认领为采购员本人的采购需求（写入确认时间和批次）。只认领尚未认领的明细，返回实际认领数量和批次号。',
      parameters: {
        ids: { type: 'array', required: true, description: '要认领的明细 id 列表。', items: { type: 'string' } },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => [{ type: 'text', text: `已认领 ${value.claimedCount} 条明细，批次 ${value.batchId}` }],
      },
      execute: async (args) => {
        const service = await this.getService()
        return await service.claim(args.ids)
      },
      presentCall: (args) => ({ card: 'generic', title: '认领采购需求', kind: 'other', rawInput: args.ids }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_update_line',
      description: '更新一条已认领明细的采购员跟进字段：供应商、预计发货时间、处理备注、下一步待办、等待对象。采购订单状态会根据关联采购订单同步，不能手动更新。只有传入的字段会被更新，其余保持不变。',
      parameters: {
        id: { type: 'string', required: true, description: '明细 id。' },
        supplier: { type: 'string', description: '供应商（采购员人工判断填写，如 东集、盈达、汉印）。' },
        expectedShipAt: { type: 'string', description: '预计发货时间（精确日期或约略文本，如“10月10日左右”）。' },
        notes: { type: 'string', description: '处理备注/决定。' },
        nextAction: { type: 'string', description: '下一步待办。' },
        waitingOn: { type: 'string', description: '当前等待对象。' },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => [{ type: 'text', text: `已更新明细 ${value.id}` }],
      },
      execute: async (args) => {
        const service = await this.getService()
        const { id, ...updates } = args
        const row = await service.updateLine(id, updates)
        return lineSummary(row)
      },
      presentCall: (args) => ({ card: 'generic', title: '更新采购需求', kind: 'other', rawInput: args.id }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_update_supplier',
      description: '批量更新已认领明细的供应商字段（采购员人工判断后填写）。只更新供应商发生变化的已认领明细，返回实际更新条数。',
      parameters: {
        ids: { type: 'array', required: true, description: '要更新供应商的已认领明细 id 列表。', items: { type: 'string' } },
        supplier: { type: 'string', required: true, description: '供应商名称，如 东集、盈达、汉印。' },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => [{ type: 'text', text: `已更新 ${value.updatedCount} 条明细的供应商为「${args.supplier}」。` }],
      },
      execute: async (args) => {
        const service = await this.getService()
        return await service.updateSuppliers(args.ids, args.supplier)
      },
      presentCall: (args) => ({ card: 'generic', title: '批量更新供应商', kind: 'other', rawInput: args.supplier }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_import',
      description: '从工作区文件路径导入 NC 请购单明细 Excel（.xls / .xlsx）。解析请购单号、行号、物料编码、物料名称等列并写入待筛选池；重复明细按识别键合并，保留已认领状态和采购员补充字段。',
      parameters: {
        file_path: { type: 'string', required: true, description: 'NC 导出的 Excel 文件绝对路径（.xls 或 .xlsx）。' },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => [{ type: 'text', text: `已导入：新增 ${value.importedCount} 条，更新 ${value.updatedCount} 条，来自 ${value.sheets.join('、')}` }],
      },
      execute: async (args) => {
        const service = await this.getService()
        const bytes = await readFileBytes(ctx, args.file_path)
        const sheets = parseNcWorkbook(bytes)
        let importedCount = 0
        let updatedCount = 0
        for (const sheet of sheets) {
          const result = await service.importLines(sheet.lines, fileBaseName(args.file_path), sheet.name)
          importedCount += result.importedCount
          updatedCount += result.updatedCount
        }
        return { importedCount, updatedCount, sheets: sheets.map((sheet) => sheet.name) }
      },
      presentCall: (args) => ({ card: 'generic', title: '导入 NC 请购单', kind: 'other', rawInput: args.file_path }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_clear_pending',
      description: '清空「待筛选」池中所有尚未认领的采购需求明细（已认领的不受影响）。返回清除的条数。',
      parameters: {},
      output: {
        schema: resultSchema(),
        render: (args, value) => [{ type: 'text', text: `已清空 ${value.clearedCount} 条待筛选明细` }],
      },
      execute: async () => {
        const service = await this.getService()
        return await service.clearPending()
      },
      presentCall: () => ({ card: 'generic', title: '清空待筛选', kind: 'other', rawInput: null }),
    }))

    ctx.tools.register(defineTool({
      name: 'procurement_delete_owned',
      description: '删除「我的需求」中选中的已认领明细。删除后不会回到待筛选池。返回删除的条数。',
      parameters: {
        ids: { type: 'array', required: true, description: '要删除的已认领明细 id 列表。', items: { type: 'string' } },
      },
      output: {
        schema: resultSchema(),
        render: (args, value) => [{ type: 'text', text: `已删除 ${value.deletedCount} 条明细` }],
      },
      execute: async (args) => {
        const service = await this.getService()
        return await service.deleteOwned(args.ids)
      },
      presentCall: (args) => ({ card: 'generic', title: '删除已认领需求', kind: 'other', rawInput: args.ids }),
    }))
  }

  // --- typert remote methods (called by the Web client via ctx.remote.procurement.*) ---

  async list(request) {
    const service = await this.getService()
    const { status, page, pageSize, sort, filters, keywords } = request
    return service.listPage(status, page, pageSize, { sort, filters, keywords })
  }

  async listPurchaseOrders(request) {
    const service = await this.getService()
    return service.listPurchaseOrders(request.page, request.pageSize, request)
  }

  async workspaceSummary(request) {
    const service = await this.getService()
    return service.workspaceSummary(request.days)
  }

  async setWorkspaceTodosRead(request) {
    const service = await this.getService()
    return service.setWorkspaceTodosRead(request.ids, request.isRead)
  }

  async updatePurchaseOrder(request) {
    const service = await this.getService()
    return service.updatePurchaseOrder(request.id, request)
  }

  async deletePurchaseOrders(request) {
    const service = await this.getService()
    return service.deletePurchaseOrders(request.ids)
  }

  async cancelPurchaseOrders(request) {
    const service = await this.getService()
    return service.cancelPurchaseOrders(request.ids)
  }

  async notifyPurchaseOrders(request) {
    const service = await this.getService()
    return service.notifyPurchaseOrders(request.ids)
  }

  async syncOwnedPurchaseOrderNumbers() {
    const service = await this.getService()
    return service.syncOwnedPurchaseOrderNumbers()
  }

  async importPurchaseOrders(request) {
    const service = await this.getService()
    return service.importPurchaseOrders(request.orders)
  }

  async search(request) {
    const service = await this.getService()
    const rows = service.search(request.keywords)
    return { count: rows.length, rows }
  }

  async claim(request) {
    const service = await this.getService()
    return await service.claim(request.ids)
  }

  async updateLine(request) {
    const service = await this.getService()
    const { id, ...updates } = request
    return await service.updateLine(id, updates)
  }

  async updateSuppliers(request) {
    const service = await this.getService()
    return await service.updateSuppliers(request.ids, request.supplier)
  }

  async importLines(request) {
    const service = await this.getService()
    const { lines, fileName, sheetName } = request
    return await service.importLines(lines, fileName, sheetName)
  }

  async clearPending() {
    const service = await this.getService()
    return await service.clearPending()
  }

  async deleteOwned(request) {
    const service = await this.getService()
    return await service.deleteOwned(request.ids)
  }

  // --- 模型设置 ---

  async listModelOptions() {
    const provider = 'deepseek-account'
    const fallback = {
      provider,
      models: [{ id: 'deepseek-flash', name: 'DeepSeek-V4.1-Flash' }],
      reasoningEfforts: [{ id: 'off', name: '关闭' }, { id: 'low', name: '低' }, { id: 'medium', name: '中' }, { id: 'high', name: '高' }],
    }
    try {
      const models = await this.ctx.llm.listModels(provider)
      const firstModel = models[0]?.id ?? 'deepseek-flash'
      const info = await this.ctx.llm.resolveModelInfo(provider, firstModel)
      const efforts = info.reasoning?.efforts?.map((effort) => ({ id: effort.id, name: effort.name }))
      return {
        provider,
        models: models.map((model) => ({ id: model.id, name: model.name })),
        reasoningEfforts: efforts && efforts.length ? efforts : fallback.reasoningEfforts,
      }
    } catch (error) {
      this.ctx.logger.warn(`[procurement] listModelOptions 回退到默认：${error instanceof Error ? error.message : String(error)}`)
      return fallback
    }
  }

  async getModelSettings() {
    const service = await this.getService()
    return service.getModelSettings()
  }

  async updateModelSettings(request) {
    const service = await this.getService()
    return await service.updateModelSettings(request.model, request.reasoningEffort)
  }

  async listMasterData(request) {
    const service = await this.getService()
    return { rows: service.listMasterData(request.type) }
  }

  async saveMasterData(request) {
    const service = await this.getService()
    const { type, ...value } = request
    return service.saveMasterData(type, value)
  }

  async setMasterDataStatus(request) {
    const service = await this.getService()
    return service.setMasterDataStatus(request.type, request.ids, request.status)
  }

  async deleteMasterData(request) {
    const service = await this.getService()
    return service.deleteMasterData(request.type, request.ids)
  }

  // --- AI 生成（LLM）---

  async aiGenerate(request) {
    const { operation, payload, sessionId } = request
    if (operation === 'filters') return this.generateFilters(payload, sessionId)
    if (operation === 'colors') return this.generateColorRules(payload, sessionId)
    if (operation === 'field-preview') return this.previewAIField(payload, sessionId)
    throw new Error(`未知的 AI 操作：${operation}`)
  }

  async generateFilters({ instruction, fields }, sessionId) {
    const allowed = aiAllowedFields(fields, 'filterable')
    const operators = [...new Set(allowed.flatMap((field) => aiOperatorsFor(field.type)))]
    const system = '你是采购工作台的智能筛选助手。根据用户的自然语言指令，生成结构化的数据筛选规则。只输出 JSON 数组，不要解释、不要输出任何其他文字。'
    const text = `用户指令：${instruction}\n\n可用字段：${JSON.stringify(aiFieldMetadata(allowed))}\n\n每条规则格式：{"id":"规则id","fieldId":"字段id","operator":"操作符","value":"筛选值","conjunction":"and"或"or"}\n\n允许的操作符：${JSON.stringify(operators)}\n\n返回 JSON 数组。`
    const settings = await this.getService().then((service) => service.getModelSettings())
    const raw = await aiComplete(this.ctx, { system, text, temperature: 0, sessionId, model: settings.model, reasoningEffort: settings.reasoningEffort })
    const parsed = aiParseJson(raw)
    if (!Array.isArray(parsed)) throw new Error('AI 筛选结果必须是数组')
    return parsed.map((item) => {
      aiValidateRule(item, allowed, 'filterable')
      if (item.conjunction !== 'and' && item.conjunction !== 'or') throw new Error('非法的 and/or 连接符')
      return { id: item.id, fieldId: item.fieldId, operator: item.operator, value: item.value, conjunction: item.conjunction }
    })
  }

  async generateColorRules({ instruction, fields }, sessionId) {
    const allowed = aiAllowedFields(fields, 'colorable')
    const system = '你是采购工作台的智能填色助手。根据用户的自然语言指令，生成结构化的填色规则。只输出 JSON 数组，不要解释。'
    const text = `用户指令：${instruction}\n\n可用字段：${JSON.stringify(aiFieldMetadata(allowed))}\n\n每条规则格式：{"id":"规则id","fieldId":"字段id","operator":"操作符","value":"值","scope":"cell|row|rowMarker|column","colorToken":"颜色token"}\n\n颜色 token：${JSON.stringify(AI_COLOR_TOKENS)}\n\n返回 JSON 数组。`
    const settings = await this.getService().then((service) => service.getModelSettings())
    const raw = await aiComplete(this.ctx, { system, text, temperature: 0, sessionId, model: settings.model, reasoningEffort: settings.reasoningEffort })
    const parsed = aiParseJson(raw)
    if (!Array.isArray(parsed)) throw new Error('AI 填色结果必须是数组')
    return parsed.map((item) => {
      aiValidateRule(item, allowed, 'colorable')
      if (!AI_COLOR_SCOPES.includes(String(item.scope))) throw new Error('非法的填色作用域')
      if (!AI_COLOR_TOKENS.includes(String(item.colorToken))) throw new Error('非法的颜色 token')
      return { id: item.id, fieldId: item.fieldId, operator: item.operator, value: item.value, scope: item.scope, colorToken: item.colorToken }
    })
  }

  async previewAIField({ definition, rows, fields }, sessionId) {
    const allowed = (definition.referencedFieldIds ?? []).map((id) => {
      const field = (fields ?? []).find((item) => item.fieldId === id)
      if (!field) throw new Error(`AI 引用字段不可读：${id}`)
      return field
    })
    const rowList = rows ?? []
    if (rowList.length > AI_MAX_FIELD_PREVIEW_ROWS) throw new Error(`AI 字段一次最多计算 ${AI_MAX_FIELD_PREVIEW_ROWS} 行，请缩小范围`)
    const system = '你是采购工作台的数据计算助手。根据字段定义，为每一行数据计算一个结果值。只输出 JSON 数组，不要解释。'
    const text = `字段定义：${JSON.stringify(definition)}\n\n引用字段说明：${JSON.stringify(aiFieldMetadata(allowed))}\n\n行数据：${JSON.stringify(rowList)}\n\n输出格式：[{"rowKey":"行标识","value":"计算值"}]，无法计算的行用 [{"rowKey":"行标识","error":"原因"}]。\n\n输出类型：${definition.outputType ?? 'text'}\n\n返回 JSON 数组。`
    const settings = await this.getService().then((service) => service.getModelSettings())
    const raw = await aiComplete(this.ctx, { system, text, temperature: 0, maxTokens: 4000, sessionId, model: settings.model, reasoningEffort: settings.reasoningEffort })
    const parsed = aiParseJson(raw)
    if (!Array.isArray(parsed)) throw new Error('AI 字段结果必须是数组')
    const rowKeys = new Set(rowList.map((row) => row.rowKey))
    const seen = new Set()
    return parsed.map((item) => {
      const value = item
      if (typeof value.rowKey !== 'string' || !rowKeys.has(value.rowKey) || seen.has(value.rowKey)) throw new Error('未知或重复的 AI 结果行')
      seen.add(value.rowKey)
      if (value.error !== undefined && typeof value.error !== 'string') throw new Error('非法的 AI 错误字段')
      if (!value.error && value.value !== undefined && value.value !== null) {
        if ((definition.outputType === 'number') ? typeof value.value !== 'number' || !Number.isFinite(value.value) : typeof value.value !== 'string') throw new Error('AI 字段结果类型错误')
      }
      return { rowKey: value.rowKey, value: value.value, error: value.error }
    })
  }
}

export { ProcurementService, ProcurementService as default }
