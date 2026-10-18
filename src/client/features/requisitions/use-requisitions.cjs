const React = require('react')
const { format } = require('date-fns')
const { parseWorkbook } = require('../../imports/parse-workbooks.cjs')
const { errorText, keywords } = require('../../components/presentation.cjs')
const { MINE_COLUMN_SETTINGS_KEY } = require('./table-config.cjs')

function text(value) { return value == null ? '' : String(value).trim() }

function useRequisitions({ data, t, setError, setSuccess }) {
  const [store, setStore] = React.useState({ pendingRows: [], mineRows: [], pendingContextRows: [], pendingTotal: 0, mineTotal: 0, pendingFilteredTotal: 0, mineFilteredTotal: 0, pendingRequisitionCount: 0, pendingFilteredRequisitionCount: 0, latestImport: null })
  const [requestView, setRequestView] = React.useState('intake')
  const [pendingPage, setPendingPage] = React.useState(1)
  const [minePage, setMinePage] = React.useState(1)
  const [pendingPageSize, setPendingPageSize] = React.useState(10)
  const [minePageSize, setMinePageSize] = React.useState(10)
  const [pendingLoading, setPendingLoading] = React.useState(false)
  const [mineLoading, setMineLoading] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [fileName, setFileName] = React.useState('')
  const [sheets, setSheets] = React.useState([])
  const [sheetIndex, setSheetIndex] = React.useState(0)
  const [selected, setSelected] = React.useState(new Set())
  const [parsing, setParsing] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const [mineSelected, setMineSelected] = React.useState(new Set())
  const [shipDate, setShipDate] = React.useState(undefined)
  const [shipDialogOpen, setShipDialogOpen] = React.useState(false)
  const [supplierDialogOpen, setSupplierDialogOpen] = React.useState(false)
  const [batchSupplierDraft, setBatchSupplierDraft] = React.useState('')
  const [savingBatchSupplier, setSavingBatchSupplier] = React.useState(false)
  const detailDialogOverlayRef = React.useRef(null)
  const [detailRow, setDetailRow] = React.useState(null)
  const [detailDraft, setDetailDraft] = React.useState(null)
  const [savingDetail, setSavingDetail] = React.useState(false)
  const fileInputRef = React.useRef(null)
  const listRequestIds = React.useRef({ pending: 0, mine: 0 })
  const keywordRef = React.useRef(query)
  const previousKeyword = React.useRef(query)
  const pendingTableQuery = React.useRef({ filters: [], sorts: [] })
  const mineTableQuery = React.useRef({ filters: [], sorts: [] })
  const loadPage = React.useCallback(async (status, requestedPage, requestedPageSize) => {
    const requestId = ++listRequestIds.current[status]
    const setLoading = status === 'pending' ? setPendingLoading : setMineLoading
    setLoading(true)
    try {
      const tableQuery = status === 'pending' ? pendingTableQuery.current : mineTableQuery.current
      const sorts = tableQuery.sorts
      const sort = sorts.length > 1 ? sorts : sorts[0]
      const request = { status, page: requestedPage, pageSize: requestedPageSize, sort, filters: tableQuery.filters, keywords: status === 'pending' ? keywordRef.current : '' }
      const value = await data.list(request.status, request.page, request.pageSize, request.sort, request.filters, request.keywords)
      if (requestId !== listRequestIds.current[status]) return value
      if (status === 'pending') {
        setPendingPage(value.page)
        setStore(current => ({ ...current, pendingRows: value.rows || [], pendingContextRows: value.contextRows || [], pendingTotal: value.statusCount ?? value.count ?? value.rows?.length ?? 0, pendingFilteredTotal: value.count ?? value.rows?.length ?? 0, pendingRequisitionCount: value.requisitionCount, pendingFilteredRequisitionCount: value.matchingRequisitionCount, latestImport: value.latestImport || null }))
      } else {
        setMinePage(value.page)
        setStore(current => ({ ...current, mineRows: value.rows || [], mineTotal: value.statusCount ?? value.count ?? value.rows?.length ?? 0, mineFilteredTotal: value.count ?? value.rows?.length ?? 0, latestImport: value.latestImport || null }))
        setDetailRow(current => current ? (value.rows || []).find(row => row.id === current.id) || current : current)
      }
      return value
    } catch (caught) {
      if (requestId === listRequestIds.current[status]) setError(caught instanceof Error ? caught.message : String(caught))
      throw caught
    } finally {
      if (requestId === listRequestIds.current[status]) setLoading(false)
    }
  }, [data])
  const refresh = React.useCallback(async () => {
    await Promise.all([
      loadPage('pending', pendingPage, pendingPageSize),
      loadPage('mine', minePage, minePageSize),
    ])
  }, [loadPage, minePage, minePageSize, pendingPage, pendingPageSize])
  React.useEffect(() => {
    void Promise.all([
      loadPage('pending', 1, 10),
      loadPage('mine', 1, 10),
    ]).catch(() => {})
  }, [loadPage])
  React.useEffect(() => {
    if (previousKeyword.current === query) return
    previousKeyword.current = query
    setSelected(new Set())
    setPendingPage(1)
    const timer = setTimeout(() => { void loadPage('pending', 1, pendingPageSize).catch(() => {}) }, 250)
    return () => clearTimeout(timer)
  }, [loadPage, pendingPageSize, query])
  function updateTableQuery(status, queryState) {
    const target = status === 'pending' ? pendingTableQuery : mineTableQuery
    target.current = queryState
    if (status === 'pending') setPendingPage(1)
    else setMinePage(1)
    void loadPage(status, 1, status === 'pending' ? pendingPageSize : minePageSize).catch(() => {})
  }

  function changePage(status, page) {
    if (status === 'pending') {
      setPendingPage(page)
      void loadPage(status, page, pendingPageSize).catch(() => {})
    } else {
      setMinePage(page)
      void loadPage(status, page, minePageSize).catch(() => {})
    }
  }
  function changePageSize(status, pageSize) {
    if (status === 'pending') {
      setPendingPageSize(pageSize); setPendingPage(1)
      void loadPage(status, 1, pageSize).catch(() => {})
    } else {
      setMinePageSize(pageSize); setMinePage(1)
      void loadPage(status, 1, pageSize).catch(() => {})
    }
  }
  function refreshTable(status) {
    const page = status === 'pending' ? pendingPage : minePage
    const pageSize = status === 'pending' ? pendingPageSize : minePageSize
    void loadPage(status, page, pageSize).catch(() => {})
  }

  function chooseFile(file) {
    if (!file) return
    setError(''); setSuccess(''); setFileName(file.name); setSheets([]); setSheetIndex(0)
    if (!/\.xlsx?$/i.test(file.name)) { setError(t('fileTypeError')); return }
    if (file.size > 20 * 1024 * 1024) { setError(t('fileSizeError')); return }
    setParsing(true)
    file.arrayBuffer().then(buffer => { const parsed = parseWorkbook(buffer, t); setSheets(parsed); setSheetIndex(Math.max(0, parsed.findIndex(item => item.lines.length > 0))) })
      .catch(caught => setError(errorText(caught instanceof Error ? caught.message : '', t))).finally(() => setParsing(false))
  }
  async function claim() {
    const ids = [...selected]
    if (!ids.length) return
    try {
      await data.claim(ids)
      setSelected(new Set()); setRequestView('mine'); setSuccess(''); setError('')
      await refresh()
    } catch { setError(t('saveError')) }
  }
  async function doImport() {
    if (!sheet || importing) return
    setImporting(true); setError(''); setSuccess('')
    try {
      const result = await data.importLines(sheet.lines, fileName, sheet.name)
      setSheets([]); setSelected(new Set()); keywordRef.current = ''; previousKeyword.current = ''; setQuery(''); setError('')
      setSuccess(`${t('imported')} ${sheet.lines.length} ${t('lines')} · ${t('added')} ${result.importedCount} · ${t('updated')} ${result.updatedCount} · ${t('masterDataImportedSummary').replace('{count}', String(result.masterDataCreatedCount || 0))}`)
      await refresh()
    } catch { setError(t('saveError')) }
    finally { setImporting(false) }
  }
  async function clearPending() {
    if (!window.confirm(t('clearPendingConfirm'))) return
    try {
      await data.clearPending()
      setSelected(new Set()); keywordRef.current = ''; previousKeyword.current = ''; setQuery(''); setPendingPage(1); setError(''); setSuccess('')
      await refresh()
    } catch { setError(t('saveError')) }
  }
  async function deleteOwned(id) {
    if (!window.confirm(t('deleteConfirm'))) return
    try {
      await data.deleteOwned([id])
      setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }
  function openDetails(row) {
    setDetailRow(row)
    setDetailDraft({
      supplier: row.supplier || '',
      expectedShipAt: row.expectedShipAt || row.buyerEtaFromFile || '',
      nextAction: row.nextAction || '',
      waitingOn: row.waitingOn || '',
      notes: row.notes || '',
    })
    setError('')
  }
  async function saveDetails() {
    if (!detailRow || !detailDraft || savingDetail) return
    setSavingDetail(true)
    setError('')
    try {
      const saved = await data.updateLine(detailRow.id, detailDraft)
      setDetailRow(saved)
      setDetailDraft({ supplier: saved.supplier || '', expectedShipAt: saved.expectedShipAt || saved.buyerEtaFromFile || '', nextAction: saved.nextAction || '', waitingOn: saved.waitingOn || '', notes: saved.notes || '' })
      setSuccess(t('detailSaved'))
      await loadPage('mine', minePage, minePageSize)
      setDetailRow(null)
      setDetailDraft(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('saveError'))
    } finally {
      setSavingDetail(false)
    }
  }
  async function saveShip(row, value) {
    const next = text(value)
    if (next === text(row.expectedShipAt || row.buyerEtaFromFile)) return
    try {
      await data.updateLine(row.id, { expectedShipAt: next })
      setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }
  const toggle = (id, checked) => setSelected(previous => { const next = new Set(previous); checked ? next.add(id) : next.delete(id); return next })
  const toggleMine = (id, checked) => setMineSelected(previous => { const next = new Set(previous); checked ? next.add(id) : next.delete(id); return next })
  async function applyShipToSelected() {
    if (!shipDate || !mineSelected.size) return
    try {
      const shipValue = format(shipDate, 'yyyy-MM-dd')
      for (const id of mineSelected) await data.updateLine(id, { expectedShipAt: shipValue })
      setMineSelected(new Set()); setShipDate(undefined); setShipDialogOpen(false); setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }
  async function applySupplierToSelected() {
    if (!mineSelected.size || savingBatchSupplier) return
    const supplier = batchSupplierDraft.trim()
    if (!supplier) return
    const ids = [...mineSelected]
    setSavingBatchSupplier(true)
    setError('')
    try {
      await data.updateSuppliers(ids, supplier)
      setSupplierDialogOpen(false)
      setBatchSupplierDraft('')
      setMineSelected(new Set())
      setSuccess(t('batchSupplierSaved').replace('{count}', String(ids.length)))
      await loadPage('mine', minePage, minePageSize)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('saveError'))
    } finally {
      setSavingBatchSupplier(false)
    }
  }
  async function deleteSelected() {
    if (!mineSelected.size) return
    if (!window.confirm(t('deleteConfirm'))) return
    try {
      await data.deleteOwned([...mineSelected])
      setMineSelected(new Set()); setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }

  const words = keywords(query)
  const sheet = sheets[sheetIndex]
  const pending = store.pendingRows
  const mine = store.mineRows
  const candidates = pending
  const selectedCount = selected.size
  const requisitionCount = store.pendingRequisitionCount

  return { store,
    requestView,
    setRequestView,
    pendingPage,
    setPendingPage,
    minePage,
    setMinePage,
    pendingPageSize,
    setPendingPageSize,
    minePageSize,
    setMinePageSize,
    pendingLoading,
    mineLoading,
    query,
    setQuery,
    fileName,
    sheets,
    sheetIndex,
    setSheetIndex,
    selected,
    setSelected,
    toggle,
    parsing,
    importing,
    dragActive,
    setDragActive,
    mineSelected,
    setMineSelected,
    toggleMine,
    shipDate,
    setShipDate,
    shipDialogOpen,
    setShipDialogOpen,
    supplierDialogOpen,
    setSupplierDialogOpen,
    batchSupplierDraft,
    savingBatchSupplier,
    detailRow,
    setDetailRow,
    detailDraft,
    setDetailDraft,
    savingDetail,
    detailDialogOverlayRef,
    fileInputRef,
    listRequestIds,
    keywordRef,
    previousKeyword,
    pendingTableQuery,
    mineTableQuery,
    words,
    sheet,
    pending,
    mine,
    candidates,
    selectedCount,
    requisitionCount,
    loadPage,
    refresh,
    updateTableQuery,
    changePage,
    changePageSize,
    refreshTable,
    chooseFile,
    claim,
    doImport,
    clearPending,
    deleteOwned,
    openDetails,
    saveDetails,
    saveShip,
    applyShipToSelected,
    applySupplierToSelected,
    deleteSelected }
}

module.exports = { useRequisitions }
