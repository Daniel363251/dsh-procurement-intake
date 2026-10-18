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


export {
  keywordSplit, LIST_FIELD_TYPES, ORDER_FIELD_TYPES, FOLLOW_UP_FIELDS, nowIso, activity,
  listFieldValue, procurementOrgFromSource, localDateString, matchesListFilter, filterListRows,
  sortListRows, orderFieldValue, purchaseOrderRequisitionNos, filterListKeywords,
}
