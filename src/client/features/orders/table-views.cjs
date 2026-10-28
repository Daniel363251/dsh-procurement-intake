const React = require('react')
const { defineAITable } = require('@enterprise/ai-table')
const h = React.createElement

function useOrderTableViews({
  t, aiAdapter, copyCell, uniqueOrderItemValues, sumOrderItemValues, formatDateTime,
  orderSelected, setOrderSelected, renderRowActionMenu, openOrderDetails, deleteOrders, cancelOrder,
}) {
  const orderDefinition = React.useMemo(() => defineAITable({
    id: 'procurement.purchase-orders', rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter },
    fields: [
      { id: 'orderNo', label: t('orderNo'), type: 'text', accessor: 'orderNo', render: value => copyCell(value, t('orderNo')), width: 210 },
      { id: 'purchaseOrderStatus', label: t('purchaseOrderStatus'), type: 'text', read: row => row.purchaseOrderStatus || '待通知供应商', render: value => h('span', { className: `pi-badge ${value === '已通知供应商' ? 'pi-badge--ok' : value === '取消了采购订单' ? 'pi-badge--danger' : 'pi-badge--warn'}` }, value === '已通知供应商' ? t('vendorNotified') : value === '取消了采购订单' ? t('purchaseOrderCancelled') : t('pendingVendorNotice')), width: 160 },
      { id: 'requisitionNos', label: t('requisitionNos'), type: 'text', read: row => (row.requisitionNos || []).join('、') || uniqueOrderItemValues(row, 'requisitionNo'), render: value => copyCell(value, t('requisitionNos')), width: 240 },
      { id: 'procurementOrg', label: t('procurementOrg'), type: 'text', read: row => row.procurementOrg || row.buyer || uniqueOrderItemValues(row, 'procurementOrg'), render: value => copyCell(value, t('procurementOrg')), width: 220 },
      { id: 'inventoryOrg', label: t('inventoryOrg'), type: 'text', read: row => row.inventoryOrg || uniqueOrderItemValues(row, 'inventoryOrg'), width: 220 },
      { id: 'orderDate', label: t('orderDateLabel'), type: 'date', accessor: 'orderDate', width: 115 },
      { id: 'supplier', label: t('supplier'), type: 'text', accessor: 'supplier', render: value => copyCell(value, t('supplier')), width: 190 },
      { id: 'anomalyFocus', label: t('anomalyFocus'), type: 'text', read: row => (row.anomalyFocus || []).map(key => t(key)).join('、'), render: (_value, row) => (row.anomalyFocus || []).length ? h('div', { className: 'pi-anomaly-tags' }, ...row.anomalyFocus.map(key => h('span', { key, className: 'pi-badge pi-badge--warn' }, t(key)))) : '—', width: 220 },
      { id: 'itemNames', label: t('orderItems'), type: 'text', read: row => (row.items || []).map(item => item.name).filter(Boolean).join('、'), render: value => copyCell(value, t('orderItems')), width: 260 },
      { id: 'itemCount', label: t('itemCount'), type: 'number', read: row => row.items?.length || 0, width: 90 },
      { id: 'itemQuantity', label: t('orderQuantity'), type: 'number', read: row => (row.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0), width: 100 },
      { id: 'expectedArrivalDate', label: t('expectedArrivalDate'), type: 'text', read: row => uniqueOrderItemValues(row, 'expectedArrivalDate'), width: 145 },
      { id: 'arrivalDate', label: t('arrivalDate'), type: 'text', read: row => uniqueOrderItemValues(row, 'arrivalDate'), width: 125 },
      { id: 'receivedQuantity', label: t('receivedQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'receivedQuantity'), width: 120 },
      { id: 'remainingQuantity', label: t('remainingQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'remainingQuantity'), width: 120 },
      { id: 'procurementOfficer', label: t('procurementOfficer'), type: 'text', read: row => row.procurementOfficer || uniqueOrderItemValues(row, 'procurementOfficer'), width: 115 },
      { id: 'procurementDepartment', label: t('procurementDepartment'), type: 'text', read: row => row.procurementDepartment || uniqueOrderItemValues(row, 'procurementDepartment'), width: 145 },
      { id: 'materialCategory', label: t('materialCategory'), type: 'text', read: row => uniqueOrderItemValues(row, 'materialCategory'), width: 120 },
      { id: 'requisitionType', label: t('requisitionType'), type: 'text', read: row => row.requisitionType || uniqueOrderItemValues(row, 'requisitionType'), width: 180 },
      { id: 'preparer', label: t('preparer'), type: 'text', read: row => row.preparer || uniqueOrderItemValues(row, 'preparer'), width: 110 },
      { id: 'project', label: t('project'), type: 'text', read: row => row.project || uniqueOrderItemValues(row, 'project'), width: 130 },
      { id: 'requisitionQuantity', label: t('requisitionQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'requisitionQuantity'), width: 125 },
      { id: 'orderedQuantity', label: t('orderedQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'orderedQuantity'), width: 125 },
      { id: 'demandDate', label: t('expectedDate'), type: 'date', read: row => uniqueOrderItemValues(row, 'demandDate'), width: 120 },
      { id: 'suggestedOrderDate', label: t('suggestedOrderDate'), type: 'date', read: row => uniqueOrderItemValues(row, 'suggestedOrderDate'), width: 135 },
      { id: 'returnedQuantity', label: t('returnedQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'returnedQuantity'), width: 125 },
      { id: 'stockInDate', label: t('stockInDate'), type: 'text', read: row => uniqueOrderItemValues(row, 'stockInDate'), width: 120 },
      { id: 'stockInQuantity', label: t('stockInQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'stockInQuantity'), width: 120 },
      { id: 'returnedStockQuantity', label: t('returnedStockQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'returnedStockQuantity'), width: 125 },
      { id: 'replenishmentQuantity', label: t('replenishmentQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'replenishmentQuantity'), width: 120 },
      { id: 'unexecutedCloseQuantity', label: t('unexecutedCloseQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'unexecutedCloseQuantity'), width: 145 },
      { id: 'requisitionLineClosed', label: t('requisitionLineClosed'), type: 'text', read: row => uniqueOrderItemValues(row, 'requisitionLineClosed'), width: 150 },
      { id: 'sourceDocumentNo', label: t('sourceDocumentNo'), type: 'text', read: row => uniqueOrderItemValues(row, 'sourceDocumentNo'), width: 160 },
      { id: 'sourceDocumentLineNo', label: t('sourceDocumentLineNo'), type: 'text', read: row => uniqueOrderItemValues(row, 'sourceDocumentLineNo'), width: 160 },
      { id: 'lineRemark', label: t('lineRemark'), type: 'text', read: row => uniqueOrderItemValues(row, 'lineRemark'), width: 180 },
      { id: 'customer', label: t('customer'), type: 'text', read: row => uniqueOrderItemValues(row, 'customer'), width: 150 },
      { id: 'taxInclusiveTotal', label: t('orderTotal'), type: 'number', accessor: 'taxInclusiveTotal', format: value => value == null ? '—' : Number(value).toLocaleString(), width: 120 },
      { id: 'taxExclusiveTotal', label: t('taxExclusiveTotal'), type: 'number', accessor: 'taxExclusiveTotal', format: value => value == null ? '—' : Number(value).toLocaleString(), width: 120 },
      { id: 'taxRate', label: t('taxRate'), type: 'text', accessor: 'taxRate', width: 85 },
      { id: 'buyer', label: t('orderBuyer'), type: 'text', accessor: 'buyer', width: 190 },
      { id: 'deliveryAddress', label: t('deliveryAddressLabel'), type: 'text', accessor: 'deliveryAddress', width: 230 },
      { id: 'recipient', label: t('recipient'), type: 'text', accessor: 'recipient', width: 110 },
      { id: 'recipientPhone', label: t('recipientPhone'), type: 'text', accessor: 'recipientPhone', width: 135 },
      { id: 'deliveryTime', label: t('deliveryTime'), type: 'date', accessor: 'deliveryTime', width: 140 },
      { id: 'paymentTerms', label: t('paymentTerms'), type: 'text', read: row => (row.paymentTerms || []).join('；'), width: 220 },
      { id: 'sourceFileName', label: t('sourceFile'), type: 'text', accessor: 'sourceFileName', width: 250 },
      { id: 'importedAt', label: t('importedAt'), type: 'datetime', accessor: 'importedAt', width: 150 },
    ],
  }), [aiAdapter, t])
  const orderSelection = Object.fromEntries([...orderSelected].map(id => [id, true]))
  const orderSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => orderSelected.has(row.id)), onChange: event => setOrderSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.original.id) : next.delete(row.original.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => h('input', { className: 'pi-check', type: 'checkbox', checked: orderSelected.has(row.original.id), onChange: event => setOrderSelected(previous => { const next = new Set(previous); event.target.checked ? next.add(row.original.id) : next.delete(row.original.id); return next }), 'aria-label': `选择 ${row.original.orderNo}` }),
  }
  const orderActionColumn = {
    id: 'actions', size: 64, enableSorting: false, enableHiding: false, meta: { sticky: 'right' },
    header: () => t('orderActions'), cell: ({ row }) => renderRowActionMenu(t('orderActions'), [
      { label: t('viewDetails'), onSelect: () => openOrderDetails(row.original) },
      { label: t('delete'), danger: true, onSelect: () => void deleteOrders([row.original.id]) },
      { label: t('cancelOrder'), danger: true, disabled: row.original.purchaseOrderStatus === '取消了采购订单', onSelect: () => void cancelOrder(row.original.id) },
    ]),
  }
  return { orderDefinition, orderSelection, orderSelectColumn, orderActionColumn }
}

module.exports = { useOrderTableViews }
