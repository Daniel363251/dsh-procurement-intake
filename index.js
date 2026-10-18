import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import * as XLSX from '@e965/xlsx'

// ---------------------------------------------------------------------------
// Domain schemas (zod). Records are plain JSON; the JSON backend persists them
// under a single unit because line identity keys contain `|`, `#` and `:` and
// therefore cannot be per-record path segments.
// ---------------------------------------------------------------------------

const activitySchema = z.object({
  id: z.string(),
  action: z.string(),
  detail: z.string(),
  createdAt: z.string(),
  actor: z.string(),
})

const requisitionLineSchema = z.object({
  id: z.string(),
  identityKey: z.string(),
  sourceRowNumber: z.number(),
  requisitionNo: z.string(),
  procurementOrg: z.string().default(''),
  lineNo: z.string(),
  materialCode: z.string(),
  materialName: z.string(),
  materialCategory: z.string().default(''),
  specification: z.string(),
  model: z.string(),
  unit: z.string(),
  quantity: z.string(),
  demandDate: z.string(),
  suggestedOrderDate: z.string(),
  remainingQuantity: z.string(),
  purchaseOrderNo: z.string(),
  supplier: z.string(),
  sourceFields: z.record(z.string(), z.string()),
  buyerEtaFromFile: z.string(),
  expectedShipAt: z.string(),
  isMine: z.boolean(),
  confirmedAt: z.string().nullable(),
  confirmationBatchId: z.string().nullable(),
  notes: z.string(),
  needsReview: z.boolean(),
  reviewReason: z.string(),
  sourceFileName: z.string(),
  importedAt: z.string(),
  orderStatus: z.string(),
  nextAction: z.string(),
  waitingOn: z.string(),
  activityLog: z.array(activitySchema),
})

const purchaseOrderItemSchema = z.object({
  sequence: z.string().default(''), name: z.string().default(''), specification: z.string().default(''),
  quantity: z.number().nullable().default(null), unit: z.string().default(''),
  taxInclusiveUnitPrice: z.number().nullable().default(null), taxExclusiveUnitPrice: z.number().nullable().default(null),
  amount: z.number().nullable().default(null),
  requisitionNo: z.string().default(''), lineNo: z.string().default(''), materialCode: z.string().default(''),
  materialCategory: z.string().default(''), inventoryOrg: z.string().default(''), requisitionType: z.string().default(''),
  preparer: z.string().default(''), procurementOrg: z.string().default(''), lineRemark: z.string().default(''),
  sourceDocumentNo: z.string().default(''), sourceDocumentLineNo: z.string().default(''),
  requisitionQuantity: z.number().nullable().default(null), orderedQuantity: z.number().nullable().default(null),
  demandDate: z.string().default(''), suggestedOrderDate: z.string().default(''),
  expectedArrivalDate: z.string().default(''), arrivalDate: z.string().default(''),
  receivedQuantity: z.number().nullable().default(null), returnedQuantity: z.number().nullable().default(null),
  remainingQuantity: z.number().nullable().default(null), stockInDate: z.string().default(''),
  customer: z.string().default(''), stockInQuantity: z.number().nullable().default(null),
  returnedStockQuantity: z.number().nullable().default(null), replenishmentQuantity: z.number().nullable().default(null),
  unexecutedCloseQuantity: z.number().nullable().default(null), requisitionLineClosed: z.string().default(''),
  procurementOfficer: z.string().default(''), procurementDepartment: z.string().default(''), project: z.string().default(''),
  deliveryAddress: z.string().default(''),
})
const purchaseOrderClauseSchema = z.object({ section: z.string(), text: z.string() })
const purchaseOrderSchema = z.object({
  id: z.string(), orderNo: z.string(), orderDate: z.string().default(''), buyer: z.string().default(''), supplier: z.string().default(''),
  purchaseOrderStatus: z.enum(['待通知供应商', '已通知供应商', '取消了采购订单']).default('待通知供应商'),
  inventoryOrg: z.string().default(''), requisitionType: z.string().default(''), preparer: z.string().default(''),
  requisitionNos: z.array(z.string()).default([]), procurementOrg: z.string().default(''),
  procurementOfficer: z.string().default(''), procurementDepartment: z.string().default(''), project: z.string().default(''),
  taxInclusiveTotal: z.number().nullable().default(null), taxExclusiveTotal: z.number().nullable().default(null), taxRate: z.string().default(''),
  items: z.array(purchaseOrderItemSchema).default([]), deliveryAddress: z.string().default(''), recipient: z.string().default(''),
  recipientPhone: z.string().default(''), deliveryTime: z.string().default(''), paymentTerms: z.array(z.string()).default([]),
  otherTerms: z.array(z.string()).default([]), clauses: z.array(purchaseOrderClauseSchema).default([]),
  sourceFileName: z.string().default(''), importedAt: z.string(),
})

const latestImportMetaSchema = z.object({
  fileName: z.string(),
  sheetName: z.string(),
  importedAt: z.string(),
  importedCount: z.number(),
  updatedCount: z.number(),
}).nullable()

const modelSettingsSchema = z.object({
  model: z.string(),
  reasoningEffort: z.string(),
})

const procurementMetaSchema = z.object({
  latestImport: latestImportMetaSchema,
  modelSettings: modelSettingsSchema.optional(),
})

const procurementDomain = defineDomain({
  name: 'procurement',
  version: 1,
  layout: 'single',
  tables: {
    requisitions: domainTable(requisitionLineSchema),
    purchase_orders: domainTable(purchaseOrderSchema),
  },
  global: {
    schema: procurementMetaSchema,
    initial: { latestImport: null },
  },
})

// ---------------------------------------------------------------------------
// NC workbook parsing (host side, so the same parser serves the agent tool and,
// later, the Web UI). Mirrors the client-side parser column-for-column.
// ---------------------------------------------------------------------------

const MAX_NC_FILE_BYTES = 20 * 1024 * 1024

function text(value) {
  return value == null ? '' : String(value).trim()
}

function normalizeHeader(value) {
  return text(value).replace(/[\s\u00a0]/g, '').toLowerCase()
}

function columnIndex(headers, aliases) {
  const wanted = new Set(aliases.map(normalizeHeader))
  return headers.findIndex((header) => wanted.has(normalizeHeader(header)))
}

function fieldAt(row, headers, aliases) {
  const index = columnIndex(headers, aliases)
  return index < 0 ? '' : text(row[index])
}

function parseSheet(name, worksheet) {
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false, blankrows: false })
  const headerIndex = rows.findIndex((row, index) => index < 15
    && columnIndex(row.map(text), ['请购单号', '请购单编号', '申请单号']) >= 0
    && columnIndex(row.map(text), ['物料名称', '商品名称']) >= 0)
  if (headerIndex < 0) throw new Error(`工作表“${name}”中没有识别到请购单号和物料名称列`)

  const originalHeaders = rows[headerIndex].map(text)
  const headers = originalHeaders.map((header, index) => header || `未命名列${index + 1}`)
  const baseRows = rows.slice(headerIndex + 1).map((row, offset) => {
    const sourceRowNumber = headerIndex + offset + 2
    const requisitionNo = fieldAt(row, headers, ['请购单号', '请购单编号', '申请单号'])
    const procurementOrg = fieldAt(row, headers, ['采购组织']) || text(row[13])
    const lineNo = fieldAt(row, headers, ['行号', '明细行号', '请购单行号'])
    const materialCode = fieldAt(row, headers, ['物料编码', '物料代码', '存货编码'])
    const materialName = fieldAt(row, headers, ['物料名称', '商品名称'])
    const identity = requisitionNo && (materialCode || materialName)
      ? [normalizeHeader(requisitionNo), normalizeHeader(lineNo), normalizeHeader(materialCode || materialName)].join('|')
      : `row:${sourceRowNumber}`
    const sourceFields = {}
    headers.forEach((header, index) => {
      if (normalizeHeader(header) === normalizeHeader('预计发货时间')) return
      const key = Object.hasOwn(sourceFields, header) ? `${header}__${index + 1}` : header
      sourceFields[key] = text(row[index])
    })
    const reviewReason = !requisitionNo ? 'missing:requisitionNo' : !materialName ? 'missing:materialName' : ''
    return {
      identity,
      sourceRowNumber,
      requisitionNo,
      procurementOrg,
      lineNo,
      materialCode,
      materialName,
      materialCategory: fieldAt(row, headers, ['物料分类', '物料类别']),
      specification: fieldAt(row, headers, ['规格', '规格型号']),
      model: fieldAt(row, headers, ['型号']),
      unit: fieldAt(row, headers, ['主单位', '单位']),
      quantity: fieldAt(row, headers, ['主数量', '请购数量', '数量']),
      demandDate: fieldAt(row, headers, ['需求日期']),
      suggestedOrderDate: fieldAt(row, headers, ['建议订货日期']),
      remainingQuantity: fieldAt(row, headers, ['未到货数量']),
      purchaseOrderNo: fieldAt(row, headers, ['订单号', '采购订单号']),
      supplier: fieldAt(row, headers, ['供应商']),
      sourceFields,
      buyerEtaFromFile: fieldAt(row, headers, ['预计发货时间']),
      expectedShipAt: '',
      reviewReason,
    }
  }).filter((row) => Object.values(row.sourceFields).some(Boolean) || row.requisitionNo || row.materialName || row.buyerEtaFromFile)

  const occurrences = new Map()
  const totals = new Map()
  for (const row of baseRows) totals.set(row.identity, (totals.get(row.identity) || 0) + 1)
  const lines = baseRows.map((row) => {
    const occurrence = occurrences.get(row.identity) || 0
    occurrences.set(row.identity, occurrence + 1)
    const identityKey = row.identity.startsWith('row:') ? row.identity : `${row.identity}#${occurrence + 1}`
    const duplicate = (totals.get(row.identity) || 0) > 1
    return {
      ...row,
      id: identityKey,
      identityKey,
      isMine: false,
      confirmedAt: null,
      confirmationBatchId: null,
      notes: '',
      needsReview: Boolean(row.reviewReason) || duplicate,
      reviewReason: row.reviewReason || (duplicate ? 'duplicateIdentity' : ''),
      sourceFileName: '',
      importedAt: '',
      orderStatus: '',
      nextAction: '',
      waitingOn: '',
      activityLog: [],
    }
  })
  return { name, lines }
}

function parseNcWorkbook(bytes) {
  const workbook = XLSX.read(bytes, { type: 'array', cellDates: true, dense: false })
  if (!workbook.SheetNames.length) throw new Error('文件中没有可读取的工作表')
  const sheets = []
  const failures = []
  for (const sheetName of workbook.SheetNames) {
    try {
      const sheet = parseSheet(sheetName, workbook.Sheets[sheetName])
      if (sheet.lines.length) sheets.push(sheet)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error))
    }
  }
  if (!sheets.length) throw new Error(failures[0] || '没有找到可导入的请购单明细')
  return sheets
}

async function readFileBytes(ctx, filePath) {
  const target = await ctx.fs.resolve(String(filePath))
  return await ctx.fs.readBytes(target, undefined, MAX_NC_FILE_BYTES)
}

function fileBaseName(filePath) {
  const parts = String(filePath).split(/[\\/]/)
  return parts[parts.length - 1] || String(filePath)
}

// ---------------------------------------------------------------------------
// Business service. One implementation, reachable later from both the Web UI
// (via the typert remote) and the agent tools below.
// ---------------------------------------------------------------------------

const keywordSplit = /[\s,，、;；|]+/
const LIST_FIELD_TYPES = {
  materialName: 'text', materialCode: 'text', materialCategory: 'text', specification: 'text', supplier: 'text', procurementOrg: 'text',
  requisitionNo: 'text', lineNo: 'text', quantity: 'number', demandDate: 'date',
  review: 'tag', remainingQuantity: 'number', purchaseOrderNo: 'text', orderStatus: 'tag',
  expectedShipAt: 'date', notes: 'text', confirmedAt: 'datetime', nextAction: 'text', waitingOn: 'text',
}
const ORDER_FIELD_TYPES = {
  orderNo: 'text', orderDate: 'date', buyer: 'text', supplier: 'text', itemNames: 'text', itemCount: 'number',
  itemQuantity: 'number', inventoryOrg: 'text', requisitionType: 'text', preparer: 'text', requisitionNos: 'text', purchaseOrderStatus: 'tag',
  procurementOrg: 'text', procurementOfficer: 'text', procurementDepartment: 'text', project: 'text',
  materialCategory: 'text', expectedArrivalDate: 'text', arrivalDate: 'text', receivedQuantity: 'number',
  returnedQuantity: 'number', remainingQuantity: 'number', stockInDate: 'text', stockInQuantity: 'number',
  returnedStockQuantity: 'number', replenishmentQuantity: 'number', unexecutedCloseQuantity: 'number',
  requisitionLineClosed: 'text', sourceDocumentNo: 'text', sourceDocumentLineNo: 'text', lineRemark: 'text',
  requisitionQuantity: 'number', orderedQuantity: 'number', demandDate: 'date', suggestedOrderDate: 'date', customer: 'text', deliveryAddress: 'text',
  taxInclusiveTotal: 'number', taxExclusiveTotal: 'number', taxRate: 'text',
  recipient: 'text', recipientPhone: 'text', deliveryTime: 'date',
  paymentTerms: 'text', sourceFileName: 'text', importedAt: 'datetime',
}
const FOLLOW_UP_FIELDS = [
  ['supplier', '供应商'],
  ['expectedShipAt', '预计发货日期'],
  ['notes', '处理备注'],
  ['nextAction', '下一步待办'],
  ['waitingOn', '等待对象'],
]

function nowIso() {
  return new Date().toISOString()
}

function activity(action, detail, createdAt = nowIso()) {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, action, detail, createdAt, actor: '采购员' }
}

function listFieldValue(row, fieldId) {
  switch (fieldId) {
    case 'procurementOrg': return row.procurementOrg || procurementOrgFromSource(row)
    case 'specification': return [row.specification, row.model].filter(Boolean).join(' · ')
    case 'quantity': return Number(row.quantity) || 0
    case 'review': return row.needsReview ? '待复核' : ''
    case 'expectedShipAt': return row.expectedShipAt || row.buyerEtaFromFile || ''
    case 'confirmedAt': return row.confirmedAt || ''
    default: return row[fieldId]
  }
}

function procurementOrgFromSource(row) {
  const sourceFields = row.sourceFields || {}
  return sourceFields['采购组织'] || sourceFields['未命名列14'] || sourceFields['Unnamed column 14'] || ''
}

function localDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function matchesListFilter(value, rule, type) {
  const current = (type === 'date' || type === 'datetime') && typeof value === 'string' ? value.slice(0, 10) : value
  const target = (type === 'date' || type === 'datetime') && rule.value === 'today' ? localDateString() : rule.value
  const left = String(current ?? '')
  const right = String(target ?? '')
  switch (rule.operator) {
    case 'isEmpty': return current == null || current === ''
    case 'notEmpty': return current != null && current !== ''
    case 'equals': return left === right
    case 'notEquals': return left !== right
    case 'contains': return left.toLowerCase().includes(right.toLowerCase())
    case 'notContains': return !left.toLowerCase().includes(right.toLowerCase())
    case 'greaterThan':
    case 'lessThan': {
      const a = type === 'date' || type === 'datetime' ? left : Number(current)
      const b = type === 'date' || type === 'datetime' ? right : Number(target)
      if ((typeof a === 'number' && Number.isNaN(a)) || (typeof b === 'number' && Number.isNaN(b))) return false
      return rule.operator === 'greaterThan' ? a > b : a < b
    }
    case 'greaterThanOrEqual':
    case 'lessThanOrEqual': {
      const a = Number(current), b = Number(target)
      if (Number.isNaN(a) || Number.isNaN(b)) return false
      return rule.operator === 'greaterThanOrEqual' ? a >= b : a <= b
    }
    case 'between': {
      if (!Array.isArray(target) || target.length !== 2) return false
      if (type === 'date' || type === 'datetime') return Boolean(target[0] && target[1] && left >= String(target[0]) && left <= String(target[1]))
      const n = Number(current), min = Number(target[0]), max = Number(target[1])
      return ![n, min, max].some(Number.isNaN) && n >= min && n <= max
    }
    case 'isToday': return (type === 'date' || type === 'datetime') && left.slice(0, 10) === localDateString()
    case 'isPast': return (type === 'date' || type === 'datetime') && left.slice(0, 10) < localDateString()
    case 'isFuture': return (type === 'date' || type === 'datetime') && left.slice(0, 10) > localDateString()
    case 'withinPastDays':
    case 'withinNextDays': {
      if (type !== 'date' && type !== 'datetime') return false
      const fieldTime = new Date(String(current)).getTime()
      if (Number.isNaN(fieldTime)) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const days = rule.operator === 'withinPastDays'
        ? Math.floor((today.getTime() - fieldTime) / 86400000)
        : Math.floor((fieldTime - today.getTime()) / 86400000)
      return days >= 0 && days <= Number(target)
    }
    default: return false
  }
}

function filterListRows(rows, filters = [], fieldTypes = LIST_FIELD_TYPES, valueOf = listFieldValue) {
  if (!filters.length) return rows
  const fields = new Map(Object.entries(fieldTypes))
  const groups = []
  let currentGroup = []
  for (const rule of filters) {
    if (!fields.has(rule.fieldId)) throw new Error(`不支持的采购筛选字段：${rule.fieldId}`)
    if (rule.conjunction === 'or' && currentGroup.length) {
      groups.push(currentGroup)
      currentGroup = [rule]
    } else currentGroup.push(rule)
  }
  if (currentGroup.length) groups.push(currentGroup)
  return rows.filter((row) => groups.some((group) => group.every((rule) =>
    matchesListFilter(valueOf(row, rule.fieldId), rule, fields.get(rule.fieldId)),
  )))
}

function sortListRows(rows, sort, fieldTypes = LIST_FIELD_TYPES, valueOf = listFieldValue) {
  const sorts = sort == null ? [] : Array.isArray(sort) ? sort : [sort]
  if (!sorts.length) return rows
  for (const rule of sorts) {
    if (!fieldTypes[rule.fieldId]) throw new Error(`不支持的采购排序字段：${rule.fieldId}`)
  }
  const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' })
  return rows.map((row, index) => ({ row, index })).sort((left, right) => {
    for (const rule of sorts) {
      const leftValue = valueOf(left.row, rule.fieldId)
      const rightValue = valueOf(right.row, rule.fieldId)
      const leftEmpty = leftValue == null || leftValue === ''
      const rightEmpty = rightValue == null || rightValue === ''
      if (leftEmpty || rightEmpty) {
        if (leftEmpty && rightEmpty) continue
        return leftEmpty ? 1 : -1
      }
      let compared
      if (fieldTypes[rule.fieldId] === 'number') compared = Number(leftValue) - Number(rightValue)
      else if (fieldTypes[rule.fieldId] === 'date' || fieldTypes[rule.fieldId] === 'datetime') {
        compared = new Date(String(leftValue)).getTime() - new Date(String(rightValue)).getTime()
        if (Number.isNaN(compared)) compared = collator.compare(String(leftValue), String(rightValue))
      } else compared = collator.compare(String(leftValue), String(rightValue))
      if (compared !== 0) return rule.direction === 'desc' ? -compared : compared
    }
    return left.index - right.index
  }).map(({ row }) => row)
}

function orderFieldValue(row, fieldId) {
  const items = row.items || []
  const uniqueValues = (key) => [...new Set(items.map((item) => item[key]).filter((value) => value != null && value !== '').map(String))].join('、')
  const sumValues = (key) => items.reduce((total, item) => total + (Number(item[key]) || 0), 0)
  switch (fieldId) {
    case 'itemNames': return items.map((item) => item.name).filter(Boolean).join('、')
    case 'itemCount': return items.length
    case 'itemQuantity': return sumValues('quantity')
    case 'requisitionNos': return purchaseOrderRequisitionNos(row).join('、')
    case 'purchaseOrderStatus': return row.purchaseOrderStatus || '待通知供应商'
    case 'inventoryOrg': return row.inventoryOrg || uniqueValues('inventoryOrg')
    case 'procurementOrg': return row.procurementOrg || row.buyer || uniqueValues('procurementOrg')
    case 'procurementOfficer': return row.procurementOfficer || uniqueValues('procurementOfficer')
    case 'procurementDepartment': return row.procurementDepartment || uniqueValues('procurementDepartment')
    case 'project': return row.project || uniqueValues('project')
    case 'materialCategory': return uniqueValues('materialCategory')
    case 'expectedArrivalDate': return uniqueValues('expectedArrivalDate')
    case 'arrivalDate': return uniqueValues('arrivalDate')
    case 'receivedQuantity': return sumValues('receivedQuantity')
    case 'returnedQuantity': return sumValues('returnedQuantity')
    case 'remainingQuantity': return sumValues('remainingQuantity')
    case 'stockInDate': return uniqueValues('stockInDate')
    case 'stockInQuantity': return sumValues('stockInQuantity')
    case 'returnedStockQuantity': return sumValues('returnedStockQuantity')
    case 'replenishmentQuantity': return sumValues('replenishmentQuantity')
    case 'unexecutedCloseQuantity': return sumValues('unexecutedCloseQuantity')
    case 'sourceDocumentNo': return uniqueValues('sourceDocumentNo')
    case 'sourceDocumentLineNo': return uniqueValues('sourceDocumentLineNo')
    case 'lineRemark': return uniqueValues('lineRemark')
    case 'requisitionQuantity': return sumValues('requisitionQuantity')
    case 'orderedQuantity': return sumValues('orderedQuantity')
    case 'demandDate': return uniqueValues('demandDate')
    case 'suggestedOrderDate': return uniqueValues('suggestedOrderDate')
    case 'requisitionType': return row.requisitionType || uniqueValues('requisitionType')
    case 'preparer': return row.preparer || uniqueValues('preparer')
    case 'customer': return uniqueValues('customer')
    case 'paymentTerms': return (row.paymentTerms || []).join('；')
    default: return row[fieldId]
  }
}

function purchaseOrderRequisitionNos(order) {
  const stored = Array.isArray(order?.requisitionNos) ? order.requisitionNos : []
  const fromItems = Array.isArray(order?.items) ? order.items.map((item) => item?.requisitionNo) : []
  return [...new Set([...stored, ...fromItems].map((value) => String(value ?? '').trim()).filter(Boolean))]
}

function filterListKeywords(rows, keywords = '') {
  const words = String(keywords ?? '').split(keywordSplit).map((word) => word.trim().toLowerCase()).filter(Boolean)
  if (!words.length) return rows
  return rows.filter((row) => words.some((word) => (row.materialName || '').toLowerCase().includes(word)))
}

function createProcurementService(domain) {
  const requisitions = () => domain.table('requisitions')
  const purchaseOrders = () => domain.table('purchase_orders')

  function all() {
    return [...requisitions().entries()].map(([, row]) => row)
  }

  function byId(id) {
    return requisitions().get(id)
  }

  function list(status = 'all') {
    const rows = all()
    if (status === 'mine') return rows.filter((row) => row.isMine)
    if (status === 'pending') return rows.filter((row) => !row.isMine)
    return rows
  }

  function listPage(status = 'all', page = 1, pageSize = 10, { sort, filters, keywords } = {}) {
    const statusRows = list(status)
    const matchingRows = sortListRows(filterListRows(filterListKeywords(statusRows, keywords), filters), sort)
    const safePageSize = Math.min(500, Math.max(1, Math.floor(Number(pageSize) || 10)))
    const pageCount = Math.max(1, Math.ceil(matchingRows.length / safePageSize))
    const safePage = Math.min(pageCount, Math.max(1, Math.floor(Number(page) || 1)))
    const start = (safePage - 1) * safePageSize
    const rows = matchingRows.slice(start, start + safePageSize)
    const keywordWords = String(keywords ?? '').split(keywordSplit).map((word) => word.trim().toLowerCase()).filter(Boolean)
    const pageRequisitionNos = new Set(rows.map((row) => row.requisitionNo).filter(Boolean))
    const contextRows = keywordWords.length
      ? statusRows.filter((row) => pageRequisitionNos.has(row.requisitionNo)
        && !keywordWords.some((word) => (row.materialName || '').toLowerCase().includes(word)))
      : []
    return {
      count: matchingRows.length,
      statusCount: statusRows.length,
      requisitionCount: new Set(statusRows.map((row) => row.requisitionNo).filter(Boolean)).size,
      matchingRequisitionCount: new Set(matchingRows.map((row) => row.requisitionNo).filter(Boolean)).size,
      page: safePage,
      pageSize: safePageSize,
      rows,
      contextRows,
      latestImport: domain.global.get().latestImport,
    }
  }

  function listPurchaseOrders(page = 1, pageSize = 10, { sort, filters } = {}) {
    const allOrders = sortListRows(filterListRows([...purchaseOrders().entries()].map(([, order]) => order), filters, ORDER_FIELD_TYPES, orderFieldValue), sort, ORDER_FIELD_TYPES, orderFieldValue)
    if (!sort || (Array.isArray(sort) && !sort.length)) allOrders.sort((left, right) => String(right.importedAt || '').localeCompare(String(left.importedAt || '')))
    const safePageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 10)))
    const pageCount = Math.max(1, Math.ceil(allOrders.length / safePageSize))
    const safePage = Math.min(pageCount, Math.max(1, Math.floor(Number(page) || 1)))
    const rows = allOrders.slice((safePage - 1) * safePageSize, safePage * safePageSize).map((order) => ({
      ...order,
      requisitionNos: purchaseOrderRequisitionNos(order),
      purchaseOrderStatus: order.purchaseOrderStatus || '待通知供应商',
    }))
    return { count: allOrders.length, page: safePage, pageSize: safePageSize, rows }
  }

  async function deletePurchaseOrders(ids) {
    let deletedCount = 0
    for (const id of new Set(ids ?? [])) {
      if (!purchaseOrders().get(id)) continue
      await purchaseOrders().delete(id)
      deletedCount += 1
    }
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { deletedCount, ...sync }
  }

  async function syncOwnedPurchaseOrderStatuses() {
    const orders = [...purchaseOrders().entries()].map(([, order]) => order)
    const byOrderNo = new Map()
    const byRequisition = new Map()
    const byRequisitionLine = new Map()
    const normalizeKey = (value) => String(value ?? '').replace(/[\s\u00a0]/g, '').toLowerCase()
    const addOrder = (map, key, order) => {
      if (!key || !order.orderNo) return
      const values = map.get(key) || new Map()
      values.set(normalizeKey(order.orderNo), order)
      map.set(key, values)
    }

    for (const order of orders) {
      const orderNoKey = normalizeKey(order.orderNo)
      if (orderNoKey) byOrderNo.set(orderNoKey, order)
      for (const item of order.items || []) {
        const requisitionKey = normalizeKey(item.requisitionNo)
        if (!requisitionKey) continue
        addOrder(byRequisition, requisitionKey, order)
        const lineKey = normalizeKey(item.sourceDocumentLineNo || item.lineNo)
        if (lineKey) addOrder(byRequisitionLine, `${requisitionKey}|${lineKey}`, order)
      }
      for (const requisitionNo of order.requisitionNos || []) {
        addOrder(byRequisition, normalizeKey(requisitionNo), order)
      }
    }

    let updatedCount = 0
    const updatedRequisitions = new Set()
    for (const [id, row] of requisitions().entries()) {
      if (!row.isMine) continue
      const linkedOrderNos = String(row.purchaseOrderNo ?? '').split(/[、,，;；\s]+/).map(normalizeKey).filter(Boolean)
      let linkedOrders = linkedOrderNos.map((orderNo) => byOrderNo.get(orderNo)).filter(Boolean)
      if (!linkedOrders.length) {
        const requisitionKey = normalizeKey(row.requisitionNo)
        const lineKey = normalizeKey(row.lineNo)
        if (requisitionKey) {
          const exactMatches = lineKey ? byRequisitionLine.get(`${requisitionKey}|${lineKey}`) : null
          const candidates = exactMatches?.size ? exactMatches : byRequisition.get(requisitionKey)
          // A requisition number can cover several purchase orders. Only infer a
          // link without a stored PO number when the row resolves unambiguously.
          if (candidates?.size === 1) linkedOrders = [...candidates.values()]
        }
      }
      const statuses = [...new Set(linkedOrders.map((order) => order.purchaseOrderStatus || '待通知供应商'))]
      if (linkedOrders.length && statuses.length !== 1) continue
      const orderNos = [...new Set(linkedOrders.map((order) => order.orderNo).filter(Boolean))]
      const nextStatus = linkedOrders.length ? statuses[0] : '未匹配采购单'
      if (nextStatus === (row.orderStatus || '')) continue
      await requisitions().update(id, (current) => ({
        ...current,
        orderStatus: nextStatus,
        activityLog: [...(current.activityLog || []), activity('同步采购订单状态', `采购订单${orderNos.length ? ` ${orderNos.join('、')}` : ''}：${current.orderStatus || '未记录'} → ${nextStatus}`)],
      }))
      updatedCount += 1
      if (row.requisitionNo) updatedRequisitions.add(normalizeKey(row.requisitionNo))
    }
    return { syncedLineCount: updatedCount, syncedRequisitionCount: updatedRequisitions.size }
  }

  async function cancelPurchaseOrders(ids) {
    let cancelledCount = 0
    for (const id of new Set(ids ?? [])) {
      const current = purchaseOrders().get(id)
      if (!current || current.purchaseOrderStatus === '取消了采购订单') continue
      await purchaseOrders().update(id, (order) => ({ ...order, purchaseOrderStatus: '取消了采购订单' }))
      cancelledCount += 1
    }
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { cancelledCount, ...sync }
  }

  async function notifyPurchaseOrders(ids) {
    let notifiedCount = 0
    for (const id of new Set(ids ?? [])) {
      const current = purchaseOrders().get(id)
      if (!current || current.purchaseOrderStatus === '取消了采购订单' || current.purchaseOrderStatus === '已通知供应商') continue
      await purchaseOrders().update(id, (order) => ({ ...order, purchaseOrderStatus: '已通知供应商' }))
      notifiedCount += 1
    }
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { notifiedCount, ...sync }
  }

  async function syncOwnedPurchaseOrderNumbers() {
    const orders = [...purchaseOrders().entries()].map(([, order]) => order)
    const byRequisition = new Map()
    const byRequisitionLine = new Map()
    const normalizeKey = (value) => String(value ?? '').replace(/[\s\u00a0]/g, '').toLowerCase()
    const addOrderNo = (map, key, orderNo) => {
      if (!key || !orderNo) return
      const values = map.get(key) || new Set()
      values.add(orderNo)
      map.set(key, values)
    }

    for (const order of orders) {
      const orderNo = String(order.orderNo ?? '').trim()
      for (const item of order.items || []) {
        const requisitionKey = normalizeKey(item.requisitionNo)
        if (!requisitionKey) continue
        addOrderNo(byRequisition, requisitionKey, orderNo)
        const lineKey = normalizeKey(item.sourceDocumentLineNo || item.lineNo)
        if (lineKey) addOrderNo(byRequisitionLine, `${requisitionKey}|${lineKey}`, orderNo)
      }
      // Older imports may have only the order-level requisition numbers.
      for (const requisitionNo of order.requisitionNos || []) {
        addOrderNo(byRequisition, normalizeKey(requisitionNo), orderNo)
      }
    }

    let updatedCount = 0
    const updatedRequisitions = new Set()
    const unmatchedRequisitions = new Set()
    for (const [id, row] of requisitions().entries()) {
      if (!row.isMine || String(row.purchaseOrderNo ?? '').trim()) continue
      const requisitionKey = normalizeKey(row.requisitionNo)
      if (!requisitionKey) { unmatchedRequisitions.add(`row:${id}`); continue }
      const lineKey = normalizeKey(row.lineNo)
      const exactMatches = lineKey ? byRequisitionLine.get(`${requisitionKey}|${lineKey}`) : null
      const orderNumbers = exactMatches?.size ? exactMatches : byRequisition.get(requisitionKey)
      if (!orderNumbers?.size) { unmatchedRequisitions.add(requisitionKey); continue }
      const purchaseOrderNo = [...orderNumbers].sort().join('、')
      await requisitions().update(id, (current) => ({
        ...current,
        purchaseOrderNo: String(current.purchaseOrderNo ?? '').trim() ? current.purchaseOrderNo : purchaseOrderNo,
      }))
      updatedCount += 1
      updatedRequisitions.add(requisitionKey)
    }
    return {
      updatedCount,
      updatedRequisitionCount: updatedRequisitions.size,
      unmatchedRequisitionCount: unmatchedRequisitions.size,
    }
  }

  async function importPurchaseOrders(orders) {
    const table = purchaseOrders()
    const incoming = []
    const seen = new Set([...table.entries()].map(([, order]) => String(order.orderNo ?? '').replace(/[\s\u00a0]/g, '').toLowerCase()))
    let skippedCount = 0
    for (const value of orders ?? []) {
      const orderNo = String(value?.orderNo ?? '').trim()
      if (!orderNo) throw new Error('采购订单缺少订单编号，无法导入')
      const normalizedOrderNo = orderNo.replace(/[\s\u00a0]/g, '').toLowerCase()
      const id = `po:${orderNo}`
      if (seen.has(normalizedOrderNo)) { skippedCount += 1; continue }
      seen.add(normalizedOrderNo)
      incoming.push(purchaseOrderSchema.parse({
        ...value,
        id,
        orderNo,
        requisitionNos: purchaseOrderRequisitionNos(value),
        importedAt: nowIso(),
      }))
    }
    for (const order of incoming) await table.put(order.id, order)
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { importedCount: incoming.length, skippedCount, ...sync }
  }

  function search(keywords) {
    const words = String(keywords ?? '').split(keywordSplit).map((word) => word.trim()).filter(Boolean)
    const rows = all()
    if (words.length === 0) return rows
    const lower = words.map((word) => word.toLowerCase())
    return rows.filter((row) => lower.some((word) => (row.materialName || '').toLowerCase().includes(word)))
  }

  async function claim(ids) {
    const unique = [...new Set(ids ?? [])]
    const now = nowIso()
    const batchId = `OWN-${Date.now().toString(36).toUpperCase()}`
    let claimedCount = 0
    for (const id of unique) {
      const row = byId(id)
      if (!row || row.isMine) continue
      await requisitions().update(id, (current) => ({
        ...current,
        isMine: true,
        confirmedAt: now,
        confirmationBatchId: batchId,
        activityLog: [...(current.activityLog || []), activity('认领采购需求', `认领批次：${batchId}`, now)],
      }))
      claimedCount += 1
    }
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { claimedCount, batchId, ...sync }
  }

  async function updateLine(id, updates) {
    const row = byId(id)
    if (!row) throw new Error(`未找到明细：${id}`)
    const changes = []
    const next = { ...row }
    for (const [field, label] of FOLLOW_UP_FIELDS) {
      if (updates[field] !== undefined && updates[field] !== row[field]) {
        changes.push(`${label}：${row[field] || '未填写'} → ${updates[field] || '未填写'}`)
        next[field] = updates[field]
      }
    }
    if (changes.length === 0) return row
    next.activityLog = [...(row.activityLog || []), activity('更新跟进信息', changes.join('；'))]
    return await requisitions().update(id, () => next)
  }

  async function updateSuppliers(ids, supplier) {
    const unique = [...new Set(ids ?? [])]
    const value = String(supplier ?? '').trim()
    let updatedCount = 0
    for (const id of unique) {
      const row = byId(id)
      if (!row || !row.isMine) continue
      if ((row.supplier || '') === value) continue
      await requisitions().update(id, (current) => ({
        ...current,
        supplier: value,
        activityLog: [...(current.activityLog || []), activity('更新供应商', `供应商：${current.supplier || '未填写'} → ${value || '未填写'}`)],
      }))
      updatedCount += 1
    }
    return { updatedCount }
  }

  async function clearPending() {
    const pending = all().filter((row) => !row.isMine)
    for (const row of pending) await requisitions().delete(row.id)
    return { clearedCount: pending.length }
  }

  async function deleteOwned(ids) {
    const unique = new Set(ids ?? [])
    let deletedCount = 0
    for (const id of unique) {
      const row = byId(id)
      if (row && row.isMine) {
        await requisitions().delete(id)
        deletedCount += 1
      }
    }
    return { deletedCount }
  }

  async function importLines(lines, fileName, sheetName) {
    const existing = new Map(all().map((row) => [row.identityKey, row]))
    const importedAt = nowIso()
    let updatedCount = 0
    const incoming = (lines ?? []).map((line) => {
      const saved = existing.get(line.identityKey)
      if (saved) updatedCount += 1
      return {
        ...saved,
        ...line,
        sourceFileName: fileName,
        importedAt,
        isMine: saved ? saved.isMine : false,
        confirmedAt: saved ? saved.confirmedAt : null,
        confirmationBatchId: saved ? saved.confirmationBatchId : null,
        notes: saved ? saved.notes : '',
        procurementOrg: line.procurementOrg || (saved && saved.procurementOrg) || '',
        expectedShipAt: saved && saved.expectedShipAt ? saved.expectedShipAt : (line.buyerEtaFromFile || ''),
        orderStatus: saved ? saved.orderStatus : '',
        nextAction: saved ? saved.nextAction : '',
        waitingOn: saved ? saved.waitingOn : '',
        supplier: saved && saved.supplier ? saved.supplier : (line.supplier || ''),
        activityLog: saved ? (saved.activityLog || []) : [],
        needsReview: Boolean(line.needsReview || (saved && saved.needsReview)),
        reviewReason: line.reviewReason || (saved && saved.reviewReason) || '',
      }
    })
    for (const row of incoming) await requisitions().put(row.id, requisitionLineSchema.parse(row))
    await domain.global.set({
      latestImport: { fileName, sheetName, importedAt, importedCount: incoming.length - updatedCount, updatedCount },
    })
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { importedCount: incoming.length - updatedCount, updatedCount, ...sync }
  }

  function getModelSettings() {
    const settings = domain.global.get().modelSettings
    if (!settings || (settings.model === 'deepseek-v4-pro' && settings.reasoningEffort === 'high')) {
      return { model: 'deepseek-flash', reasoningEffort: 'off' }
    }
    return settings
  }

  async function updateModelSettings(model, reasoningEffort) {
    const current = domain.global.get()
    await domain.global.set({ ...current, modelSettings: { model, reasoningEffort } })
    return { model, reasoningEffort }
  }

  // 一次性回填：旧明细已把「物料分类」存进 sourceFields，但没有独立字段。
  async function migrateMaterialCategory() {
    let migratedCount = 0
    for (const row of all()) {
      const fromSource = (row.sourceFields && row.sourceFields['物料分类']) || ''
      if (!row.materialCategory && fromSource) {
        await requisitions().update(row.id, (current) => ({
          ...current,
          materialCategory: fromSource,
        }))
        migratedCount += 1
      }
    }
    return migratedCount
  }

  async function migrateProcurementOrg() {
    let migratedCount = 0
    for (const row of all()) {
      const fromSource = procurementOrgFromSource(row)
      if (!row.procurementOrg && fromSource) {
        await requisitions().update(row.id, (current) => ({ ...current, procurementOrg: fromSource }))
        migratedCount += 1
      }
    }
    return migratedCount
  }

  return {
    all,
    list,
    listPage,
    listPurchaseOrders,
    importPurchaseOrders,
    deletePurchaseOrders,
    syncOwnedPurchaseOrderStatuses,
    cancelPurchaseOrders,
    notifyPurchaseOrders,
    syncOwnedPurchaseOrderNumbers,
    search,
    claim,
    updateLine,
    updateSuppliers,
    clearPending,
    deleteOwned,
    importLines,
    migrateMaterialCategory,
    latestImport: () => domain.global.get().latestImport,
    getModelSettings,
    updateModelSettings,
    migrateProcurementOrg,
  }
}

// ---------------------------------------------------------------------------
// Agent tools. The model drives the same service methods the UI will call.
// ---------------------------------------------------------------------------

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

const AI_OPERATORS_BY_TYPE = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'notEmpty'],
  number: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'isEmpty', 'notEmpty'],
  tag: ['equals', 'notEquals', 'isEmpty', 'notEmpty'],
  date: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between', 'isToday', 'isPast', 'isFuture', 'withinPastDays', 'withinNextDays', 'isEmpty', 'notEmpty'],
  datetime: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between', 'isToday', 'isPast', 'isFuture', 'withinPastDays', 'withinNextDays', 'isEmpty', 'notEmpty'],
}

const AI_COLOR_TOKENS = ['red', 'lightRed', 'green', 'lightGreen', 'yellow', 'blue', 'lightBlue']
const AI_COLOR_SCOPES = ['cell', 'row', 'rowMarker', 'column']
const AI_MAX_FIELD_PREVIEW_ROWS = 50
const AI_RETRYABLE_CODES = new Set(['TRANSPORT', 'SERVER', 'TIMEOUT', 'RATE_LIMIT', 'EMPTY_RESPONSE', 'UNKNOWN'])
const AI_MAX_ATTEMPTS = 3

function aiOperatorsFor(type) {
  return AI_OPERATORS_BY_TYPE[type] ?? ['equals']
}

function aiFieldMetadata(fields) {
  return (fields ?? []).map((field) => ({ fieldId: field.fieldId, label: field.label, type: field.type, options: field.options ?? [] }))
}

function aiAllowedFields(fields) {
  // 客户端已按 aiReadable + filterable/colorable 过滤后只传字段元数据，宿主直接使用。
  return fields ?? []
}

async function aiComplete(ctx, { system, text, temperature = 0, maxTokens = 2000, signal, sessionId, model = 'deepseek-flash', reasoningEffort = 'off' }) {
  // 使用 deepseek-account（PKCE 登录，与当前 Agent 同一条路径）。
  // 模型与推理强度由用户在「模型设置」里选择，持久化后经 generate* 方法传入。
  const selection = { provider: 'deepseek-account', model, reasoningEffort }
  let lastFailure = null
  for (let attempt = 1; attempt <= AI_MAX_ATTEMPTS; attempt++) {
    let result = ''
    let finishError = null
    for await (const chunk of ctx.llm.stream({
      provider: selection.provider,
      model: selection.model,
      reasoningEffort: selection.reasoningEffort,
      system,
      messages: [{ role: 'user', content: [{ type: 'text', text }] }],
      temperature,
      maxTokens,
      signal,
      sessionId,
    })) {
      if (chunk.type === 'text-delta') {
        result += chunk.text
      } else if (chunk.type === 'finish' && chunk.reason) {
        if (chunk.reason.kind === 'error') {
          finishError = chunk.reason.failure ?? { message: '未知错误', code: 'UNKNOWN' }
        } else if (chunk.reason.kind === 'aborted') {
          throw new Error('AI 调用已取消')
        }
      }
    }
    if (!finishError) return result
    if (!AI_RETRYABLE_CODES.has(finishError.code) || attempt === AI_MAX_ATTEMPTS) {
      throw new Error(`AI 调用失败（${finishError.code}）：${finishError.message}`)
    }
    lastFailure = finishError
    ctx.logger.warn(`[procurement] AI 调用失败（${finishError.code}），第 ${attempt} 次重试`)
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
  }
  throw new Error(`AI 调用失败：${lastFailure?.message ?? '未知错误'}`)
}

function aiParseJson(text) {
  const trimmed = String(text ?? '').trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1].trim() : trimmed
  const arrayStart = body.indexOf('[')
  const objectStart = body.indexOf('{')
  let start = -1
  let end = -1
  if (arrayStart >= 0 && (objectStart < 0 || arrayStart < objectStart)) {
    start = arrayStart
    end = body.lastIndexOf(']')
  } else if (objectStart >= 0) {
    start = objectStart
    end = body.lastIndexOf('}')
  }
  if (start < 0 || end < start) throw new Error('AI 没有返回可解析的 JSON')
  return JSON.parse(body.slice(start, end + 1))
}

function aiValidateRule(value, fields, capability) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('AI 规则必须是对象')
  const field = fields.find((item) => item.fieldId === value.fieldId)
  if (!field) throw new Error(`未知或不可用的 AI 字段：${String(value.fieldId)}`)
  if (!aiOperatorsFor(field.type).includes(value.operator)) throw new Error(`字段「${field.label}」不支持操作符 ${String(value.operator)}`)
  if (typeof value.id !== 'string' || !value.id) throw new Error('AI 规则 id 必填')
  return field
}

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

export { ProcurementService, ProcurementService as default, parseNcWorkbook, requisitionLineSchema }
