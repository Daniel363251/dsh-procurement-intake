import {
  procurementDomain, requisitionLineSchema, purchaseOrderSchema, purchaseOrderItemSchema,
  supplierMasterSchema, materialMasterSchema, materialCategoryMasterSchema,
} from './schemas.js'
import { normalizeHeader } from './imports/parse-nc-workbook.js'
import {
  LIST_FIELD_TYPES, ORDER_FIELD_TYPES, FOLLOW_UP_FIELDS, nowIso, activity, listFieldValue,
  procurementOrgFromSource, filterListRows, sortListRows, orderFieldValue,
  purchaseOrderRequisitionNos, filterListKeywords, keywordSplit,
} from './list-query.js'

function createProcurementService(domain) {
  const requisitions = () => domain.table('requisitions')
  const purchaseOrders = () => domain.table('purchase_orders')
  const masterTables = { suppliers: 'suppliers', materials: 'materials', materialCategories: 'material_categories' }
  const masterSchemas = { suppliers: supplierMasterSchema, materials: materialMasterSchema, materialCategories: materialCategoryMasterSchema }
  const masterTable = (type) => {
    const table = masterTables[type]
    if (!table) throw new Error(`基础资料类型无效：${type}`)
    return domain.table(table)
  }
  const masterKey = (type, value) => {
    if (type === 'suppliers' || type === 'materialCategories') return normalizeHeader(value.name)
    const code = normalizeHeader(value.code)
    return code ? `code:${code}` : `name:${normalizeHeader(value.name)}|${normalizeHeader(value.specification)}`
  }
  const masterId = (type, key) => `${type}:${Buffer.from(key).toString('base64url')}`

  function masterStatus(type, value) {
    if (!value) return ''
    const key = masterKey(type, value)
    return masterTable(type).get(masterId(type, key))?.status || ''
  }

  function requisitionAnomalyFocus(row) {
    const focus = []
    const materialStatus = masterStatus('materials', {
      code: row.materialCode, name: row.materialName,
      specification: [row.specification, row.model].filter(Boolean).join(' · '),
    })
    if (materialStatus === 'disabled') focus.push('materialDisabled')
    if (masterStatus('suppliers', { name: row.supplier }) === 'disabled') focus.push('supplierDisabled')
    const category = row.materialCategory || row.sourceFields?.['物料分类'] || row.sourceFields?.['物料类别']
    if (masterStatus('materialCategories', { name: category }) === 'disabled') focus.push('categoryDisabled')
    return [...new Set(focus)]
  }

  function orderAnomalyFocus(order) {
    const focus = []
    if (masterStatus('suppliers', { name: order.supplier }) === 'disabled') focus.push('supplierDisabled')
    for (const item of order.items || []) {
      if (masterStatus('materials', { code: item.materialCode, name: item.name, specification: item.specification }) === 'disabled') focus.push('materialDisabled')
      if (masterStatus('materialCategories', { name: item.materialCategory }) === 'disabled') focus.push('categoryDisabled')
    }
    return [...new Set(focus)]
  }

  async function upsertImportedMaster(type, incoming) {
    const value = { ...incoming, name: String(incoming.name ?? '').trim() }
    if (!value.name) return false
    if (type === 'materials') {
      value.code = String(value.code ?? '').trim()
      value.category = String(value.category ?? '').trim()
      value.specification = String(value.specification ?? '').trim()
      value.unit = String(value.unit ?? '').trim()
    }
    const key = masterKey(type, value)
    if (!key || key === 'name:|') return false
    const table = masterTable(type)
    const id = masterId(type, key)
    const current = table.get(id)
    const now = nowIso()
    const merged = current
      ? { ...current, ...Object.fromEntries(Object.entries(value).filter(([field, fieldValue]) => field !== 'name' && fieldValue && !current[field])), updatedAt: now }
      : { ...value, id, status: 'enabled', createdAt: now, updatedAt: now }
    if (current && !current.name) merged.name = value.name
    await table.put(id, masterSchemas[type].parse(merged))
    return !current
  }

  async function collectImportedMasterData({ lines = [], orders = [] } = {}) {
    let createdCount = 0
    for (const line of lines) {
      createdCount += Number(await upsertImportedMaster('suppliers', { name: line.supplier }))
      createdCount += Number(await upsertImportedMaster('materials', {
        code: line.materialCode, name: line.materialName, category: line.materialCategory || line.sourceFields?.['物料分类'] || line.sourceFields?.['物料类别'],
        specification: [line.specification, line.model].filter(Boolean).join(' · '), unit: line.unit,
      }))
      createdCount += Number(await upsertImportedMaster('materialCategories', { name: line.materialCategory || line.sourceFields?.['物料分类'] || line.sourceFields?.['物料类别'] }))
    }
    for (const order of orders) {
      createdCount += Number(await upsertImportedMaster('suppliers', { name: order.supplier }))
      for (const item of order.items || []) {
        createdCount += Number(await upsertImportedMaster('materials', {
          code: item.materialCode, name: item.name, category: item.materialCategory,
          specification: item.specification, unit: item.unit,
        }))
        createdCount += Number(await upsertImportedMaster('materialCategories', { name: item.materialCategory }))
      }
    }
    return { createdCount }
  }

  function listMasterData(type) {
    return [...masterTable(type).entries()].map(([, row]) => row)
      .sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'))
  }

  async function saveMasterData(type, value) {
    const schema = masterSchemas[type]
    const table = masterTable(type)
    const name = String(value.name ?? '').trim()
    if (!name) throw new Error('名称不能为空')
    const current = value.id ? table.get(value.id) : null
    const now = nowIso()
    const normalized = {
      ...current,
      ...value,
      id: current?.id || masterId(type, masterKey(type, { ...value, name })),
      name,
      status: current?.status || 'enabled',
      createdAt: current?.createdAt || now,
      updatedAt: now,
    }
    if (type === 'materials') {
      for (const field of ['code', 'category', 'specification', 'unit']) normalized[field] = String(normalized[field] ?? '').trim()
    }
    const key = masterKey(type, normalized)
    const duplicate = [...table.entries()].some(([id, row]) => id !== normalized.id && masterKey(type, row) === key)
    if (duplicate) throw new Error(type === 'materials' ? '相同物料编码或名称规格已存在' : '该名称已存在')
    await table.put(normalized.id, schema.parse(normalized))
    return schema.parse(normalized)
  }

  async function setMasterDataStatus(type, ids, status) {
    if (!['enabled', 'disabled'].includes(status)) throw new Error('启用状态无效')
    const table = masterTable(type)
    let updatedCount = 0
    for (const id of new Set(ids || [])) {
      const row = table.get(id)
      if (!row || row.status === status) continue
      await table.update(id, current => masterSchemas[type].parse({ ...current, status, updatedAt: nowIso() }))
      updatedCount += 1
    }
    return { updatedCount }
  }

  async function deleteMasterData(type, ids) {
    const table = masterTable(type)
    let deletedCount = 0
    for (const id of new Set(ids || [])) {
      if (!table.get(id)) continue
      await table.delete(id)
      deletedCount += 1
    }
    return { deletedCount }
  }

  async function seedMasterDataFromStoredImports() {
    return collectImportedMasterData({
      lines: all(),
      orders: [...purchaseOrders().entries()].map(([, order]) => order),
    })
  }

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
    const rows = matchingRows.slice(start, start + safePageSize).map(row => ({
      ...row,
      anomalyFocus: status === 'mine' ? requisitionAnomalyFocus(row) : [],
    }))
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
      activityLog: order.activityLog || [],
      requisitionNos: purchaseOrderRequisitionNos(order),
      purchaseOrderStatus: order.purchaseOrderStatus || '待通知供应商',
      anomalyFocus: orderAnomalyFocus(order),
    }))
    return { count: allOrders.length, page: safePage, pageSize: safePageSize, rows }
  }

  function workspaceSummary(days = 30) {
    const safeDays = Math.min(90, Math.max(7, Math.floor(Number(days) || 30)))
    const requisitionRows = all()
    const ownedRows = requisitionRows.filter((row) => row.isMine)
    const pendingRows = requisitionRows.filter((row) => !row.isMine)
    const orders = [...purchaseOrders().entries()].map(([, order]) => ({
      ...order,
      requisitionNos: purchaseOrderRequisitionNos(order),
      purchaseOrderStatus: order.purchaseOrderStatus || '待通知供应商',
    }))
    const dateKey = (value) => {
      if (!value) return ''
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
    }
    const today = new Date()
    const trend = Array.from({ length: safeDays }, (_, index) => {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (safeDays - index - 1)))
      return { date: date.toISOString().slice(0, 10), requisitions: 0, orders: 0 }
    })
    const trendByDate = new Map(trend.map((item) => [item.date, item]))
    for (const row of requisitionRows) {
      const bucket = trendByDate.get(dateKey(row.importedAt))
      if (bucket) bucket.requisitions += 1
    }
    for (const order of orders) {
      const bucket = trendByDate.get(dateKey(order.importedAt))
      if (bucket) bucket.orders += 1
    }

    const overdueItems = []
    const todayKey = dateKey(today)
    for (const order of orders) {
      for (const item of order.items || []) {
        const expectedDate = dateKey(item.expectedArrivalDate)
        const remaining = Number(item.remainingQuantity ?? ((item.orderedQuantity ?? 0) - (item.receivedQuantity ?? 0)))
        if (expectedDate && expectedDate < todayKey && remaining > 0) overdueItems.push({ order, item, expectedDate, remaining })
      }
    }

    const todoCandidates = [
      ...orders.filter((order) => order.purchaseOrderStatus === '待通知供应商').map((order) => ({
        id: `order:${order.id}:notify`, type: 'order', entityId: order.id, title: '通知供应商',
        description: `${order.orderNo}${order.supplier ? ` · ${order.supplier}` : ''}`,
        recordNo: order.orderNo, entity: order, priority: 1,
      })),
      ...ownedRows.filter((row) => String(row.nextAction || '').trim()).map((row) => ({
        id: `request:${row.id}:next`, type: 'request', entityId: row.id, title: row.nextAction,
        description: `${row.requisitionNo || '未填写请购单号'} · ${row.materialName || '采购明细'}`,
        dueDate: row.expectedShipAt || '', recordNo: row.requisitionNo, entity: row, priority: 2,
      })),
      ...overdueItems.map(({ order, item, expectedDate, remaining }) => ({
        id: `order:${order.id}:overdue:${item.sequence || item.name}`, type: 'order', entityId: order.id, title: '预计到货已逾期',
        description: `${order.orderNo} · ${item.name || '采购明细'} · 未到 ${remaining}`,
        dueDate: expectedDate, recordNo: order.orderNo, entity: order, priority: 0,
      })),
    ].sort((left, right) => left.priority - right.priority || String(left.createdAt || left.dueDate || '').localeCompare(String(right.createdAt || right.dueDate || '')))
    const readIds = new Set(domain.global.get().workspaceReadTodoIds || [])
    const todos = todoCandidates
      .map((item) => ({ ...item, isRead: readIds.has(item.id) }))
      .sort((left, right) => Number(left.isRead) - Number(right.isRead) || left.priority - right.priority || String(left.createdAt || left.dueDate || '').localeCompare(String(right.createdAt || right.dueDate || '')))

    const recentActivity = [
      ...ownedRows.flatMap((row) => (row.activityLog || []).map((entry) => ({
        id: `request:${row.id}:${entry.id}`, type: 'request', entityId: row.id, title: entry.action,
        detail: entry.detail || '', createdAt: entry.createdAt || '', recordNo: row.requisitionNo, entity: row,
      }))),
      ...orders.flatMap((order) => (order.activityLog || []).map((entry) => ({
        id: `order:${order.id}:${entry.id}`, type: 'order', entityId: order.id, title: entry.action,
        detail: entry.detail || '', createdAt: entry.createdAt || '', recordNo: order.orderNo, entity: order,
      }))),
    ].sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt))).slice(0, 8)

    return {
      generatedAt: nowIso(),
      counts: {
        pendingLines: pendingRows.length,
        ownedLines: ownedRows.length,
        purchaseOrders: orders.length,
        waitingVendorNotice: orders.filter((order) => order.purchaseOrderStatus === '待通知供应商').length,
        unmatchedPurchaseOrders: ownedRows.filter((row) => !String(row.purchaseOrderNo || '').trim()).length,
        overdueDeliveries: overdueItems.length,
      },
      trend,
      todos,
      recentActivity,
    }
  }

  async function setWorkspaceTodosRead(ids, isRead) {
    const uniqueIds = [...new Set((ids || []).filter((id) => typeof id === 'string' && id))]
    const current = domain.global.get()
    const readIds = new Set(current.workspaceReadTodoIds || [])
    for (const id of uniqueIds) {
      if (isRead) readIds.add(id)
      else readIds.delete(id)
    }
    await domain.global.set({ ...current, workspaceReadTodoIds: [...readIds] })
    return { updatedCount: uniqueIds.length }
  }

  async function updatePurchaseOrder(id, updates) {
    const current = purchaseOrders().get(id)
    if (!current) throw new Error(`未找到采购订单：${id}`)
    const editableFields = [
      ['orderNo', '订单编号'], ['purchaseOrderStatus', '采购订单状态'], ['orderDate', '订单日期'],
      ['procurementOrg', '采购组织'], ['inventoryOrg', '库存组织'], ['supplier', '供应商'],
      ['requisitionType', '请购类型'], ['preparer', '制单人'], ['procurementOfficer', '采购员'],
      ['procurementDepartment', '采购部门'], ['project', '项目'], ['taxInclusiveTotal', '含税总额'],
      ['taxExclusiveTotal', '未税总额'], ['taxRate', '税率'], ['deliveryAddress', '交付地点'],
      ['recipient', '收货人'], ['recipientPhone', '联系电话'], ['deliveryTime', '交付时间'],
    ]
    const numericFields = new Set(['taxInclusiveTotal', 'taxExclusiveTotal'])
    const next = { ...current }
    const changes = []
    for (const [field, label] of editableFields) {
      if (updates[field] === undefined) continue
      const value = numericFields.has(field)
        ? (updates[field] === null || updates[field] === '' ? null : Number(updates[field]))
        : String(updates[field] ?? '').trim()
      if (numericFields.has(field) && value !== null && !Number.isFinite(value)) throw new Error(`${label}必须是有效数字`)
      if (field === 'purchaseOrderStatus' && !['待通知供应商', '已通知供应商', '取消了采购订单'].includes(value)) {
        throw new Error('采购订单状态无效')
      }
      const previousValue = current[field] ?? ''
      if (String(previousValue) === String(value ?? '')) continue
      changes.push(`${label}：${previousValue === '' ? '未填写' : previousValue} → ${value === null || value === '' ? '未填写' : value}`)
      next[field] = value
      if (field === 'procurementOrg') next.buyer = value
    }
    if (!changes.length) return { ...current, activityLog: current.activityLog || [], requisitionNos: purchaseOrderRequisitionNos(current) }

    if (next.orderNo !== current.orderNo) {
      const normalizedOrderNo = String(next.orderNo).replace(/[\s\u00a0]/g, '').toLowerCase()
      if (!normalizedOrderNo) throw new Error('订单编号不能为空')
      const duplicate = [...purchaseOrders().entries()].some(([otherId, order]) => otherId !== id
        && String(order.orderNo ?? '').replace(/[\s\u00a0]/g, '').toLowerCase() === normalizedOrderNo)
      if (duplicate) throw new Error('该订单编号已存在')
    }

    next.activityLog = [...(current.activityLog || []), activity('编辑采购订单信息', changes.join('；'))]
    const saved = await purchaseOrders().update(id, () => purchaseOrderSchema.parse(next))
    if (current.purchaseOrderStatus !== saved.purchaseOrderStatus) await syncOwnedPurchaseOrderStatuses()
    return { ...saved, requisitionNos: purchaseOrderRequisitionNos(saved) }
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
      await purchaseOrders().update(id, (order) => ({
        ...order,
        purchaseOrderStatus: '取消了采购订单',
        activityLog: [...(order.activityLog || []), activity('取消采购订单', `采购订单状态：${order.purchaseOrderStatus || '待通知供应商'} → 取消了采购订单`)],
      }))
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
      await purchaseOrders().update(id, (order) => ({
        ...order,
        purchaseOrderStatus: '已通知供应商',
        activityLog: [...(order.activityLog || []), activity('通知供应商', `采购订单状态：${order.purchaseOrderStatus || '待通知供应商'} → 已通知供应商`)],
      }))
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
    const masterData = await collectImportedMasterData({ orders: incoming })
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { importedCount: incoming.length, skippedCount, masterDataCreatedCount: masterData.createdCount, ...sync }
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
    const masterData = await collectImportedMasterData({ lines: incoming })
    await domain.global.set({ ...domain.global.get(),
      latestImport: { fileName, sheetName, importedAt, importedCount: incoming.length - updatedCount, updatedCount },
    })
    const sync = await syncOwnedPurchaseOrderStatuses()
    return { importedCount: incoming.length - updatedCount, updatedCount, masterDataCreatedCount: masterData.createdCount, ...sync }
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
    workspaceSummary,
    setWorkspaceTodosRead,
    updatePurchaseOrder,
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
    listMasterData,
    saveMasterData,
    setMasterDataStatus,
    deleteMasterData,
    seedMasterDataFromStoredImports,
    migrateProcurementOrg,
  }
}

// ---------------------------------------------------------------------------
// Agent tools. The model drives the same service methods the UI will call.
// ---------------------------------------------------------------------------

export { createProcurementService }
