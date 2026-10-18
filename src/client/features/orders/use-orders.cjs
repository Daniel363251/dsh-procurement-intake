const React = require('react')
const { parsePurchaseOrderWorkbook } = require('../../imports/parse-workbooks.cjs')
const { uniqueOrderItemValues } = require('../../components/presentation.cjs')

function useOrders({ data, t, menu, setError, setSuccess, loadPage, refresh, minePage, minePageSize, normalize }) {
  const [parsing, setParsing] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [orderRows, setOrderRows] = React.useState([])
  const [orderCount, setOrderCount] = React.useState(0)
  const [orderView, setOrderView] = React.useState('manage')
  const [orderPage, setOrderPage] = React.useState(1)
  const [orderPageSize, setOrderPageSize] = React.useState(10)
  const [orderLoading, setOrderLoading] = React.useState(false)
  const [notifyingOrders, setNotifyingOrders] = React.useState(false)
  const [syncingPurchaseOrders, setSyncingPurchaseOrders] = React.useState(false)
  const [orderSelected, setOrderSelected] = React.useState(new Set())
  const [orderDetailRow, setOrderDetailRow] = React.useState(null)
  const [orderDetailDraft, setOrderDetailDraft] = React.useState(null)
  const [editingOrderDetails, setEditingOrderDetails] = React.useState(false)
  const [savingOrderDetails, setSavingOrderDetails] = React.useState(false)
  const [orderPreview, setOrderPreview] = React.useState([])
  const [orderPreviewSelected, setOrderPreviewSelected] = React.useState(new Set())
  const [orderFileErrors, setOrderFileErrors] = React.useState([])
  const [orderDuplicateCount, setOrderDuplicateCount] = React.useState(0)
  const [orderSkippedRows, setOrderSkippedRows] = React.useState(0)
  const orderTableQuery = React.useRef({ filters: [], sorts: [] })
  const orderFileInputRef = React.useRef(null)
  async function loadOrders(page = orderPage, pageSize = orderPageSize) {
    setOrderLoading(true)
    try {
      const query = orderTableQuery.current
      const sorts = query.sorts || []
      const sort = sorts.length > 1 ? sorts : sorts[0]
      const result = await data.listPurchaseOrders(page, pageSize, sort, query.filters || [])
      setOrderRows(result.rows || [])
      setOrderCount(result.count || 0)
      setOrderPage(result.page || page)
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)) }
    finally { setOrderLoading(false) }
  }
  function orderDraftFrom(row) {
    return {
      orderNo: row.orderNo || '', purchaseOrderStatus: row.purchaseOrderStatus || '待通知供应商', orderDate: row.orderDate || '',
      procurementOrg: row.procurementOrg || row.buyer || '', inventoryOrg: row.inventoryOrg || uniqueOrderItemValues(row, 'inventoryOrg'),
      supplier: row.supplier || '', requisitionType: row.requisitionType || uniqueOrderItemValues(row, 'requisitionType'),
      preparer: row.preparer || uniqueOrderItemValues(row, 'preparer'), procurementOfficer: row.procurementOfficer || uniqueOrderItemValues(row, 'procurementOfficer'),
      procurementDepartment: row.procurementDepartment || uniqueOrderItemValues(row, 'procurementDepartment'), project: row.project || uniqueOrderItemValues(row, 'project'),
      taxInclusiveTotal: row.taxInclusiveTotal == null ? '' : String(row.taxInclusiveTotal), taxExclusiveTotal: row.taxExclusiveTotal == null ? '' : String(row.taxExclusiveTotal),
      taxRate: row.taxRate || '', deliveryAddress: row.deliveryAddress || '', recipient: row.recipient || '', recipientPhone: row.recipientPhone || '', deliveryTime: row.deliveryTime || '',
    }
  }
  function openOrderDetails(row) {
    setOrderDetailRow(row)
    setOrderDetailDraft(orderDraftFrom(row))
    setEditingOrderDetails(false)
    setError('')
  }
  async function saveOrderDetails() {
    if (!orderDetailRow || !orderDetailDraft || savingOrderDetails) return
    setSavingOrderDetails(true); setError('')
    try {
      const updates = {
        ...orderDetailDraft,
        taxInclusiveTotal: orderDetailDraft.taxInclusiveTotal === '' ? null : Number(orderDetailDraft.taxInclusiveTotal),
        taxExclusiveTotal: orderDetailDraft.taxExclusiveTotal === '' ? null : Number(orderDetailDraft.taxExclusiveTotal),
      }
      const saved = await data.updatePurchaseOrder(orderDetailRow.id, updates)
      setOrderDetailRow(saved); setOrderDetailDraft(orderDraftFrom(saved)); setEditingOrderDetails(false)
      setSuccess(t('orderInfoSaved'))
      await Promise.all([loadOrders(orderPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setSavingOrderDetails(false) }
  }
  React.useEffect(() => { if (menu === 'orders') void loadOrders(orderPage) }, [menu])

  async function chooseOrderFiles(fileList) {
    const files = [...(fileList || [])].filter(file => /\.xlsx?$/i.test(file.name))
    setError(''); setSuccess(''); setOrderPreview([]); setOrderPreviewSelected(new Set()); setOrderFileErrors([]); setOrderDuplicateCount(0); setOrderSkippedRows(0)
    if (!files.length) { setError(t('folderNoExcel')); return }
    setParsing(true)
    const parsed = [], failures = []
    let skippedRows = 0
    try {
      for (const file of files) {
        const filePath = file.webkitRelativePath || file.name
        if (file.size > 20 * 1024 * 1024) { failures.push(`${filePath}：${t('fileSizeError')}`); continue }
        try {
          const result = await parsePurchaseOrderWorkbook(await file.arrayBuffer(), filePath)
          parsed.push(...result.orders)
          skippedRows += result.skippedRows || 0
        }
        catch (caught) { failures.push(`${filePath}：${caught instanceof Error ? caught.message : t('fileReadError')}`) }
      }
      const existing = new Set()
      const pageSize = 100
      let page = 1, count = 0
      do {
        const result = await data.listPurchaseOrders(page, pageSize)
        count = result.count || 0
        for (const order of result.rows || []) existing.add(normalize(order.orderNo))
        page += 1
      } while ((page - 1) * pageSize < count)

      const seen = new Set(existing)
      let duplicateCount = 0
      const uniqueOrders = parsed.filter(order => {
        const key = normalize(order.orderNo)
        if (seen.has(key)) { duplicateCount += 1; return false }
        seen.add(key)
        return true
      })
      setOrderPreview(uniqueOrders); setOrderPreviewSelected(new Set()); setOrderDuplicateCount(duplicateCount); setOrderFileErrors(failures); setOrderSkippedRows(skippedRows)
      if (!uniqueOrders.length && duplicateCount) setSuccess(t('allOrdersDuplicate').replace('{count}', String(duplicateCount)))
      else if (!uniqueOrders.length && skippedRows) setSuccess(t('skippedOrderRows').replace('{count}', String(skippedRows)))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('saveError'))
    } finally { setParsing(false) }
  }
  async function importOrders(importAll = false) {
    const ordersToImport = importAll ? orderPreview : orderPreview.filter(order => orderPreviewSelected.has(normalize(order.orderNo)))
    if (!ordersToImport.length || importing) return
    const importedOrderNos = new Set(ordersToImport.map(order => normalize(order.orderNo)))
    setImporting(true); setError('')
    try {
      const result = await data.importPurchaseOrders(ordersToImport)
      const remainingOrders = orderPreview.filter(order => !importedOrderNos.has(normalize(order.orderNo)))
      setOrderPreview(remainingOrders); setOrderPreviewSelected(new Set())
      if (!remainingOrders.length) {
        setOrderDuplicateCount(0)
        if (!orderFileErrors.length) setOrderView('manage')
      }
      setSuccess(`${t('orderImportSuccess')}：新增 ${result.importedCount} 张，重复跳过 ${result.skippedCount} 张 · ${t('masterDataImportedSummary').replace('{count}', String(result.masterDataCreatedCount || 0))}`)
      await Promise.all([loadOrders(1), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setImporting(false) }
  }

  async function deleteOrders(ids) {
    const uniqueIds = [...new Set(ids)]
    if (!uniqueIds.length || !window.confirm(`${t('deleteOrdersConfirm')} (${uniqueIds.length})`)) return
    setError(''); setSuccess('')
    try {
      const result = await data.deletePurchaseOrders(uniqueIds)
      setOrderSelected(new Set())
      setSuccess(`已删除 ${result.deletedCount} 张采购订单`)
      const nextPage = orderRows.length === uniqueIds.length && orderPage > 1 ? orderPage - 1 : orderPage
      await Promise.all([loadOrders(nextPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
  }

  async function cancelOrder(id) {
    const order = orderRows.find(item => item.id === id)
    if (!order || order.purchaseOrderStatus === '取消了采购订单') return
    if (!window.confirm(t('cancelOrderConfirm'))) return
    setError(''); setSuccess('')
    try {
      await data.cancelPurchaseOrders([id])
      setSuccess(t('cancelOrderSuccess'))
      await Promise.all([loadOrders(orderPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
  }

  async function notifySelectedOrders() {
    const ids = [...orderSelected]
    if (!ids.length || notifyingOrders || !window.confirm(t('notifyOrdersConfirm').replace('{count}', String(ids.length)))) return
    setNotifyingOrders(true); setError(''); setSuccess('')
    try {
      const result = await data.notifyPurchaseOrders(ids)
      setOrderSelected(new Set())
      setSuccess(t('notifyOrdersSuccess').replace('{count}', String(result.notifiedCount)))
      await Promise.all([loadOrders(orderPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setNotifyingOrders(false) }
  }

  async function syncPurchaseOrderNumbers() {
    if (syncingPurchaseOrders) return
    setSyncingPurchaseOrders(true); setError(''); setSuccess('')
    try {
      const result = await data.syncOwnedPurchaseOrderNumbers()
      setSuccess(t('syncPurchaseOrdersResult')
        .replace('{count}', String(result.updatedRequisitionCount))
        .replace('{lines}', String(result.updatedCount))
        .replace('{unmatched}', String(result.unmatchedRequisitionCount)))
      await refresh()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setSyncingPurchaseOrders(false) }
  }

  function updateOrderTableQuery(queryState) {
    orderTableQuery.current = queryState
    setOrderSelected(new Set())
    void loadOrders(1).catch(() => {})
  }

  return { orderParsing: parsing, orderImporting: importing, orderRows,
    orderCount,
    orderView,
    setOrderView,
    orderPage,
    orderPageSize,
    setOrderPageSize,
    orderLoading,
    notifyingOrders,
    syncingPurchaseOrders,
    orderSelected,
    setOrderSelected,
    orderDetailRow,
    setOrderDetailRow,
    orderDetailDraft,
    setOrderDetailDraft,
    editingOrderDetails,
    setEditingOrderDetails,
    savingOrderDetails,
    orderPreview,
    orderPreviewSelected,
    setOrderPreviewSelected,
    orderFileErrors,
    orderDuplicateCount,
    orderSkippedRows,
    orderTableQuery,
    orderFileInputRef,
    loadOrders,
    orderDraftFrom,
    openOrderDetails,
    saveOrderDetails,
    chooseOrderFiles,
    importOrders,
    deleteOrders,
    cancelOrder,
    notifySelectedOrders,
    syncPurchaseOrderNumbers,
    updateOrderTableQuery }
}

module.exports = { useOrders }
