import * as XLSX from '@e965/xlsx'

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


export { MAX_NC_FILE_BYTES, text, normalizeHeader, parseNcWorkbook, readFileBytes, fileBaseName }
