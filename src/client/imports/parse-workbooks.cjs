const XLSX = require('@e965/xlsx')

function text(value) { return value == null ? '' : String(value).trim() }
function normalize(value) { return text(value).replace(/[\s\u00a0]/g, '').toLowerCase() }
function column(headers, aliases) { const names = new Set(aliases.map(normalize)); return headers.findIndex(header => names.has(normalize(header))) }
function field(row, headers, aliases) { const index = column(headers, aliases); return index < 0 ? '' : text(row[index]) }
function fieldWithFallbackColumn(row, headers, aliases, fallbackIndex) {
  const index = column(headers, aliases)
  return text(row[index >= 0 ? index : fallbackIndex])
}
function parseSheet(name, worksheet, t) {
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false, blankrows: false })
  const headerIndex = rows.findIndex((row, index) => index < 15 && column(row.map(text), ['请购单号', '请购单编号', '申请单号']) >= 0 && column(row.map(text), ['物料名称', '商品名称']) >= 0)
  if (headerIndex < 0) throw new Error(`noHeader:${name}`)
  const originalHeaders = rows[headerIndex].map(text)
  const headers = originalHeaders.map((header, index) => header || t('rowName').replace('{index}', String(index + 1)))
  const baseRows = rows.slice(headerIndex + 1).map((row, offset) => {
    const sourceRowNumber = headerIndex + offset + 2
    const requisitionNo = field(row, headers, ['请购单号', '请购单编号', '申请单号'])
    const procurementOrg = field(row, headers, ['采购组织']) || text(row[13])
    const lineNo = field(row, headers, ['行号', '明细行号', '请购单行号'])
    const materialCode = field(row, headers, ['物料编码', '物料代码', '存货编码'])
    const materialName = field(row, headers, ['物料名称', '商品名称'])
    const identity = requisitionNo && (materialCode || materialName) ? [normalize(requisitionNo), normalize(lineNo), normalize(materialCode || materialName)].join('|') : `row:${sourceRowNumber}`
    const sourceFields = {}
    headers.forEach((header, index) => { if (normalize(header) !== normalize('预计发货时间')) { const key = Object.hasOwn(sourceFields, header) ? `${header}__${index + 1}` : header; sourceFields[key] = text(row[index]) } })
    const reviewReason = !requisitionNo ? 'missing:requisitionNo' : !materialName ? 'missing:materialName' : ''
    return {
      identity, sourceRowNumber, requisitionNo, procurementOrg, lineNo, materialCode, materialName,
      materialCategory: field(row, headers, ['物料分类', '物料类别']),
      specification: field(row, headers, ['规格', '规格型号']), model: field(row, headers, ['型号']), unit: field(row, headers, ['主单位', '单位']),
      quantity: field(row, headers, ['主数量', '请购数量', '数量']), demandDate: field(row, headers, ['需求日期']), suggestedOrderDate: field(row, headers, ['建议订货日期']),
      remainingQuantity: field(row, headers, ['未到货数量']), purchaseOrderNo: field(row, headers, ['订单号', '采购订单号']), supplier: field(row, headers, ['供应商']),
      sourceFields, buyerEtaFromFile: field(row, headers, ['预计发货时间']), expectedShipAt: '', reviewReason,
    }
  }).filter(row => Object.values(row.sourceFields).some(Boolean) || row.requisitionNo || row.materialName || row.buyerEtaFromFile)
  const occurrences = new Map(), totals = new Map()
  baseRows.forEach(row => totals.set(row.identity, (totals.get(row.identity) || 0) + 1))
  const lines = baseRows.map(row => {
    const occurrence = occurrences.get(row.identity) || 0; occurrences.set(row.identity, occurrence + 1)
    const identityKey = row.identity.startsWith('row:') ? row.identity : `${row.identity}#${occurrence + 1}`
    const duplicate = (totals.get(row.identity) || 0) > 1
    return { ...row, id: identityKey, identityKey, isMine: false, confirmedAt: null, confirmationBatchId: null, notes: '', needsReview: Boolean(row.reviewReason) || duplicate, reviewReason: row.reviewReason || (duplicate ? 'duplicateIdentity' : ''), sourceFileName: '', importedAt: '', orderStatus: '', nextAction: '', waitingOn: '', activityLog: [] }
  })
  return { name, headers: originalHeaders.filter(Boolean), lines, warningCount: lines.filter(row => row.needsReview).length }
}
function parseWorkbook(buffer, t) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, dense: false })
  if (!workbook.SheetNames.length) throw new Error('noSheets')
  const parsed = [], failures = []
  for (const name of workbook.SheetNames) { try { const sheet = parseSheet(name, workbook.Sheets[name], t); if (sheet.lines.length) parsed.push(sheet) } catch (error) { failures.push(error instanceof Error ? error.message : `noHeader:${name}`) } }
  if (!parsed.length) throw new Error(failures[0] || 'noRows')
  return parsed
}
function numericValue(value) {
  const match = String(value ?? '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : null
}
function uniqueRowText(row) { return [...new Set(row.map(text).filter(Boolean))] }
function cellLabel(row, aliases) {
  const index = column(row.map(text), aliases)
  return index < 0 ? '' : XLSX.utils.encode_cell({ r: 0, c: index }).replace(/1$/, '')
}
function templateSheetError(sheetName, rows, fileName) {
  const expected = ['请购单号', '订单号', '采购组织', '物料名称']
  let best = { index: -1, score: 0, headers: [] }
  rows.slice(0, 30).forEach((row, index) => {
    const headers = row.map(text)
    const score = [
      column(headers, ['请购单号', '请购单编号']) >= 0,
      column(headers, ['订单号', '采购订单号', '采购订单编号']) >= 0,
      column(headers, ['采购组织']) >= 0,
      column(headers, ['物料名称']) >= 0,
    ].filter(Boolean).length
    if (score > best.score) best = { index, score, headers }
  })
  if (best.score > 0) {
    const missing = expected.filter((label, index) => {
      const aliases = [['请购单号', '请购单编号'], ['订单号', '采购订单号', '采购订单编号'], ['采购组织'], ['物料名称']][index]
      return column(best.headers, aliases) < 0
    })
    return `${fileName} · 工作表“${sheetName}”第 ${best.index + 1} 行表头不完整：缺少「${missing.join('」「')}」。`
  }
  return ''
}
function valueAfterLabel(values, pattern) {
  const index = values.findIndex(value => pattern.test(value))
  if (index < 0) return ''
  return values.slice(index + 1).find(value => !pattern.test(value) && !/^(产品交付|其他约定|付款期限|甲方|乙方)$/.test(value)) || ''
}
function parsePurchaseOrderWorkbook(buffer, fileName) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, dense: false })
  if (!workbook.SheetNames.length) throw new Error(`${fileName}：工作簿中没有工作表。`)
  const sheetErrors = []
  for (const sheetName of workbook.SheetNames) {
    // Keep blank rows so row indexes match the Excel row numbers shown to users.
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '', raw: false, blankrows: true })
    const executionHeaderIndex = rows.findIndex(row => {
      const headers = row.map(text)
      return column(headers, ['请购单号', '请购单编号']) >= 0
        && column(headers, ['订单号', '采购订单号', '采购订单编号']) >= 0
        && column(headers, ['采购组织']) >= 0
        && column(headers, ['物料名称']) >= 0
    })
    if (executionHeaderIndex >= 0) {
      const headers = rows[executionHeaderIndex].map(text)
      const grouped = new Map()
      let skippedRows = 0
      const distinct = values => [...new Set(values.map(text).filter(Boolean))]
      const addDistinct = (current, value) => distinct([...(current ? current.split('、') : []), value]).join('、')
      for (let index = executionHeaderIndex + 1; index < rows.length; index += 1) {
        const row = rows[index]
        if (!row.some(value => text(value))) continue
        const requisitionNo = fieldWithFallbackColumn(row, headers, ['请购单号', '请购单编号'], 0)
        if (requisitionNo === '合计') continue
        const orderNo = fieldWithFallbackColumn(row, headers, ['订单号', '采购订单号', '采购订单编号'], 19)
        const name = field(row, headers, ['物料名称'])
        if (orderNo && !requisitionNo) {
          const reqColumn = cellLabel(headers, ['请购单号', '请购单编号']) || 'A'
          throw new Error(`${fileName} · 工作表“${sheetName}”第 ${index + 1} 行单元格 ${reqColumn}${index + 1}（请购单号）为空；该行订单号为「${orderNo}」。`)
        }
        if (!orderNo || !name) { skippedRows += 1; continue }
        const procurementOrg = field(row, headers, ['采购组织'])
        const inventoryOrg = field(row, headers, ['库存组织'])
        const requisitionType = field(row, headers, ['请购类型'])
        const preparer = field(row, headers, ['制单人'])
        const supplier = field(row, headers, ['供应商'])
        const orderDate = field(row, headers, ['订单日期'])
        const deliveryAddress = field(row, headers, ['收货地址'])
        const project = field(row, headers, ['项目'])
        const procurementOfficer = field(row, headers, ['采购员'])
        const procurementDepartment = field(row, headers, ['采购部门'])
        let order = grouped.get(orderNo)
        if (!order) {
          order = {
            orderNo, orderDate, buyer: procurementOrg, supplier, inventoryOrg, requisitionType, preparer,
            requisitionNos: [], procurementOrg, procurementOfficer, procurementDepartment, project,
            taxInclusiveTotal: null, taxExclusiveTotal: null, taxRate: '', items: [],
            deliveryAddress, recipient: '', recipientPhone: '', deliveryTime: '', paymentTerms: [],
            otherTerms: [], clauses: [], sourceFileName: fileName,
          }
          grouped.set(orderNo, order)
        }
        order.orderDate ||= orderDate
        order.supplier ||= supplier
        order.buyer ||= procurementOrg
        order.procurementOrg = addDistinct(order.procurementOrg, procurementOrg)
        order.inventoryOrg = addDistinct(order.inventoryOrg, inventoryOrg)
        order.requisitionType = addDistinct(order.requisitionType, requisitionType)
        order.preparer = addDistinct(order.preparer, preparer)
        order.procurementOfficer = addDistinct(order.procurementOfficer, procurementOfficer)
        order.procurementDepartment = addDistinct(order.procurementDepartment, procurementDepartment)
        order.project = addDistinct(order.project, project)
        order.deliveryAddress = addDistinct(order.deliveryAddress, deliveryAddress)
        if (requisitionNo && !order.requisitionNos.includes(requisitionNo)) order.requisitionNos.push(requisitionNo)
        const specification = distinct([field(row, headers, ['规格']), field(row, headers, ['型号'])]).join(' / ')
        const requisitionQuantity = numericValue(field(row, headers, ['主数量']))
        const orderedQuantity = numericValue(field(row, headers, ['订货主数量']))
        order.items.push({
          sequence: field(row, headers, ['行号']), name, specification,
          quantity: orderedQuantity ?? requisitionQuantity, unit: field(row, headers, ['主单位']),
          taxInclusiveUnitPrice: null, taxExclusiveUnitPrice: null, amount: null,
          requisitionNo, lineNo: field(row, headers, ['行号']), materialCode: field(row, headers, ['物料编码']),
          materialCategory: field(row, headers, ['物料分类']), inventoryOrg, requisitionType, preparer,
          procurementOrg, lineRemark: field(row, headers, ['行备注']),
          sourceDocumentNo: field(row, headers, ['源头单据号']), sourceDocumentLineNo: field(row, headers, ['源头单据行号']),
          requisitionQuantity, orderedQuantity,
          demandDate: field(row, headers, ['需求日期']), suggestedOrderDate: field(row, headers, ['建议订货日期']),
          expectedArrivalDate: field(row, headers, ['计划到货日期']), arrivalDate: field(row, headers, ['到货日期']),
          receivedQuantity: numericValue(field(row, headers, ['到货主数量'])),
          returnedQuantity: numericValue(field(row, headers, ['退货主数量'])),
          remainingQuantity: numericValue(field(row, headers, ['未到货数量'])),
          stockInDate: field(row, headers, ['入库日期']), customer: field(row, headers, ['客户']),
          stockInQuantity: numericValue(field(row, headers, ['入库主数量'])),
          returnedStockQuantity: numericValue(field(row, headers, ['退库主数量'])),
          replenishmentQuantity: numericValue(field(row, headers, ['补货主数量'])),
          unexecutedCloseQuantity: numericValue(field(row, headers, ['未执行关闭数量'])),
          requisitionLineClosed: field(row, headers, ['请购单行关闭标识']),
          procurementOfficer, procurementDepartment, project, deliveryAddress,
        })
      }
      const orders = [...grouped.values()].map(order => ({
        ...order,
        requisitionNos: distinct([
          ...order.requisitionNos,
          ...order.items.map(item => item.requisitionNo),
        ]),
      }))
      return { orders, skippedRows }
    }
    const orderRow = rows.findIndex(row => row.some(value => /订单编号/.test(text(value))))
    const headerRow = rows.findIndex(row => row.some(value => /序号/.test(text(value))) && row.some(value => /产品名称/.test(text(value))) && row.some(value => /^数量$/.test(text(value))))
    if (orderRow < 0 || headerRow < 0) {
      const detail = templateSheetError(sheetName, rows, fileName)
      if (detail) sheetErrors.push(detail)
      continue
    }
    const orderNoLabelIndex = rows[orderRow].findIndex(value => /订单编号/.test(text(value)))
    const orderNo = text(rows[orderRow].slice(orderNoLabelIndex + 1).find(value => text(value)))
    if (!orderNo) {
      const labelColumn = rows[orderRow].findIndex(value => /订单编号/.test(text(value)))
      const valueColumn = rows[orderRow].slice(labelColumn + 1).findIndex(value => text(value)) + labelColumn + 1
      const columnName = XLSX.utils.encode_cell({ r: 0, c: Math.max(0, valueColumn) }).replace(/1$/, '')
      throw new Error(`${fileName} · 工作表“${sheetName}”第 ${orderRow + 1} 行单元格 ${columnName}${orderRow + 1}（订单编号）为空。`)
    }
    const headers = rows[headerRow].map(text)
    const itemColumn = (pattern) => headers.findIndex(value => pattern.test(value))
    const sequenceColumn = itemColumn(/序号/), nameColumn = itemColumn(/产品名称/)
    const specificationColumns = headers.map((value, index) => /品牌|型号|规格/.test(value) ? index : -1).filter(index => index >= 0)
    const quantityColumn = itemColumn(/^数量$/), unitColumn = itemColumn(/^单位$/), taxInclusivePriceColumn = itemColumn(/含税单价/), taxExclusivePriceColumn = itemColumn(/不含税单价/), amountColumn = itemColumn(/金额/)
    const items = []
    for (let index = headerRow + 1; index < rows.length; index += 1) {
      const row = rows[index]
      const sequence = text(row[sequenceColumn])
      const name = text(row[nameColumn])
      const quantity = numericValue(row[quantityColumn])
      if (!name || quantity == null || !sequence || !/^\d+$/.test(sequence)) continue
      items.push({ sequence, name, specification: [...new Set(specificationColumns.map(columnIndex => text(row[columnIndex])).filter(Boolean))].join(' / '), quantity, unit: text(row[unitColumn]), taxInclusiveUnitPrice: numericValue(row[taxInclusivePriceColumn]), taxExclusiveUnitPrice: numericValue(row[taxExclusivePriceColumn]), amount: numericValue(row[amountColumn]) })
    }
    if (!items.length) throw new Error(`${fileName} · 工作表“${sheetName}”第 ${headerRow + 1} 行检测到商品表头，但下方没有有效商品明细；请检查序号、产品名称和数量列。`)
    const clauses = []
    const paymentTerms = [], otherTerms = []
    let deliveryAddress = '', recipient = '', recipientPhone = '', deliveryTime = '', buyer = '', supplier = '', orderDate = ''
    let taxInclusiveTotal = null, taxExclusiveTotal = null, taxRate = ''
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index], values = uniqueRowText(row), line = values.join(' ')
      if (/合计金额/.test(line)) {
        const amounts = [...line.matchAll(/(?:￥|¥|CNY)?\s*(-?\d[\d,]*(?:\.\d+)?)/g)].map(match => Number(match[1].replace(/,/g, ''))).filter(Number.isFinite)
        if (amounts.length >= 2) { taxInclusiveTotal = amounts[0]; taxExclusiveTotal = amounts[1] }
        taxRate = line.match(/\d+(?:\.\d+)?\s*%/)?.[0] || ''
      }
      if (/付款期限/.test(line)) { const clause = values.slice(1).join(' ').trim(); if (clause && !paymentTerms.includes(clause)) paymentTerms.push(clause); clauses.push({ section: '付款', text: clause || line }) }
      else if (/产品交付/.test(line)) { const clause = values.slice(1).join(' ').trim(); if (clause && !otherTerms.includes(clause)) otherTerms.push(clause); clauses.push({ section: '交付', text: clause || line }) }
      else if (/其他约定|发票/.test(line)) { const clause = values.slice(1).join(' ').trim(); if (clause && !otherTerms.includes(clause)) otherTerms.push(clause); clauses.push({ section: '其他约定', text: clause || line }) }
      if (/交付地点/.test(line)) deliveryAddress = valueAfterLabel(values, /交付地点/) || deliveryAddress
      if (/收货人姓名/.test(line)) recipient = valueAfterLabel(values, /收货人姓名/) || recipient
      if (/收货人电话/.test(line)) recipientPhone = valueAfterLabel(values, /收货人电话/) || recipientPhone
      if (/交付时间/.test(line)) deliveryTime = valueAfterLabel(values, /交付时间/) || deliveryTime
      if (/甲方/.test(line) && !buyer) buyer = valueAfterLabel(values, /甲方/) || ''
      if (/乙方/.test(line) && !supplier) supplier = valueAfterLabel(values, /乙方/) || ''
      if (/日期/.test(line) && !orderDate) orderDate = values.find(value => /\d{4}[-/.年]\d{1,2}/.test(value)) || ''
    }
    return { orders: [{ orderNo, orderDate, buyer, supplier, taxInclusiveTotal, taxExclusiveTotal, taxRate, items, deliveryAddress, recipient, recipientPhone, deliveryTime, paymentTerms, otherTerms, clauses, sourceFileName: fileName }], skippedRows: 0 }
  }
  throw new Error(sheetErrors.length
    ? `未识别到采购订单模板：\n${sheetErrors.join('\n')}`
    : `${fileName}：未识别到采购订单模板。请确认文件使用采购订单模板，并包含请购单号、订单号、采购组织和物料名称等表头。`)
}

module.exports = { parseWorkbook, parsePurchaseOrderWorkbook }
