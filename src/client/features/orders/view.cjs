const React = require('react')
const { RefreshCw, Send } = require('lucide-react')
const { AIDataTable } = require('@enterprise/ai-table')
const { TRASH_ICON } = require('../../components/presentation.cjs')
const h = React.createElement

function renderOrdersView({
  t, orderView, orderCount, parsing, importing, orderFileInputRef, chooseOrderFiles,
  orderFileErrors, orderSkippedRows, orderPreview, orderPreviewSelected, setOrderPreviewSelected,
  importOrders, syncingPurchaseOrders, notifyingOrders, syncPurchaseOrderNumbers, notifySelectedOrders,
  orderSelected, deleteOrders, loadOrders, orderPage, orderLoading, setOrderView, emptyStateContent,
  orderDefinition, orderRows, ORDER_COLUMN_SETTINGS_KEY, orderPageSize, setOrderPageSize,
  updateOrderTableQuery, ORDER_QUERY_FIELD_IDS, orderSelection, setOrderSelected,
  orderSelectColumn, orderActionColumn, sumOrderItemValues, normalize, tableRefreshButton,
}) {
  const selectedOrderPreviewCount = orderPreview.filter(order => orderPreviewSelected.has(normalize(order.orderNo))).length
  return h('section', { className: 'pi-card pi-order-page' },
    h('div', { className: 'pi-table-toolbar' }, h('h2', { className: 'pi-section-title' }, orderView === 'import' ? t('orderImportTab') : t('orderManageTab')),
      orderView === 'manage' ? h('span', { className: 'pi-table-total' }, t('orderTotalCount').replace('{count}', String(orderCount))) : null),
    orderView === 'import' ? h(React.Fragment, null,
      h('div', { className: 'pi-order-import-toolbar' }, h('p', { className: 'pi-help' }, t('orderImportHelp')),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary pi-order-import-button', disabled: parsing || importing, onClick: () => orderFileInputRef.current?.click() }, parsing ? t('parsing') : t('orderFiles'))),
      h('input', { ref: orderFileInputRef, className: 'pi-hidden-input', type: 'file', multiple: true, webkitdirectory: true, directory: true, accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', onChange: event => { void chooseOrderFiles(event.currentTarget.files); event.currentTarget.value = '' } }),
      orderFileErrors.length > 0 ? h('div', { className: 'pi-order-errors', role: 'status' }, h('strong', null, t('orderParseError')), h('ul', null, ...orderFileErrors.map((message, index) => h('li', { key: `${index}:${message}` }, message)))) : null,
      orderPreview.length > 0 ? h('section', { className: 'pi-order-preview' },
        orderSkippedRows > 0 ? h('p', { className: 'pi-help' }, `${t('skippedOrderRows').replace('{count}', String(orderSkippedRows))} ${t('skippedOrderRowsHelp')}`) : null,
        h('div', { className: 'pi-order-preview-toolbar' },
          h('div', { className: 'pi-order-preview-selection' },
            h('label', { className: 'pi-order-select-all' }, h('input', { className: 'pi-check', type: 'checkbox', checked: orderPreview.length > 0 && selectedOrderPreviewCount === orderPreview.length, disabled: importing, onChange: event => setOrderPreviewSelected(event.target.checked ? new Set(orderPreview.map(order => normalize(order.orderNo))) : new Set()), 'aria-label': t('selectAllQualified') }),
              h('span', null, t('selectAllQualified'))),
            h('span', { className: 'pi-order-selected-count' }, t('selectedQualifiedCount').replace('{selected}', String(selectedOrderPreviewCount)).replace('{total}', String(orderPreview.length)))),
          h('div', { className: 'pi-order-preview-actions' },
            h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: importing, onClick: () => void importOrders(true) }, importing ? t('orderImporting') : t('importAllOrders')),
            h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', disabled: importing || !selectedOrderPreviewCount, onClick: () => void importOrders(false) }, importing ? t('orderImporting') : t('importSelectedOrders')))),
        h('div', { className: 'pi-order-preview-list' }, ...orderPreview.map(order => {
          const key = normalize(order.orderNo)
          return h('div', { className: 'pi-order-preview-row', key: order.orderNo },
            h('input', { className: 'pi-check', type: 'checkbox', checked: orderPreviewSelected.has(key), disabled: importing, onChange: event => setOrderPreviewSelected(previous => { const next = new Set(previous); event.target.checked ? next.add(key) : next.delete(key); return next }), 'aria-label': `选择 ${order.orderNo}` }),
            h('strong', { title: `${order.orderNo} · ${t('requisitionNos')}: ${(order.requisitionNos || []).join('、') || '—'}` }, `${order.orderNo} · ${(order.requisitionNos || []).join('、') || '请购单号缺失'}`), h('span', { title: order.procurementOrg || order.buyer }, order.procurementOrg || order.buyer || '—'),
            h('span', { title: order.supplier }, order.supplier || '—'),
            h('span', null, `${order.items.length} ${t('itemCount')} · ${sumOrderItemValues(order, 'quantity')}`),
            h('span', { title: order.sourceFileName }, order.sourceFileName)
          )
        }))) : null)
      : h(React.Fragment, null,
        orderCount > 0 ? h('div', { className: 'pi-batch-bar' },
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: syncingPurchaseOrders || notifyingOrders, onClick: () => void syncPurchaseOrderNumbers() }, h(RefreshCw, { size: 15, strokeWidth: 2, 'aria-hidden': true }), syncingPurchaseOrders ? t('syncPurchaseOrdersLoading') : t('syncPurchaseOrders')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-order-batch-notify', disabled: !orderSelected.size || notifyingOrders || syncingPurchaseOrders, onClick: () => void notifySelectedOrders() }, h(Send, { size: 15, strokeWidth: 2, 'aria-hidden': true }), notifyingOrders ? t('saving') : t('notifyOrdersSelected')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--danger pi-order-batch-delete', disabled: !orderSelected.size || notifyingOrders || syncingPurchaseOrders, onClick: () => void deleteOrders([...orderSelected]) }, TRASH_ICON, orderSelected.size ? t('deleteOrdersSelected').replace('{count}', String(orderSelected.size)) : t('deleteSelected')),
          tableRefreshButton(() => void loadOrders(orderPage), orderLoading || syncingPurchaseOrders || notifyingOrders)) : null,
        orderCount === 0 && !orderLoading ? h('div', { className: 'pi-empty' }, emptyStateContent('暂无采购订单', '请先导入订单 Excel。', {
          action: h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary pi-order-import-button', style: { marginTop: 12 }, onClick: () => setOrderView('import') }, t('startOrderImport')),
        })) : h(AIDataTable, {
          definition: orderDefinition, rows: orderRows, storageScope: 'hilda:dsh-procurement-intake',
          defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
          columnSettings: { storageKey: ORDER_COLUMN_SETTINGS_KEY, fieldOverrides: {
            buyer: { defaultVisible: false }, itemCount: { defaultVisible: false }, taxInclusiveTotal: { defaultVisible: false },
            taxExclusiveTotal: { defaultVisible: false }, taxRate: { defaultVisible: false }, recipient: { defaultVisible: false },
            recipientPhone: { defaultVisible: false }, deliveryTime: { defaultVisible: false }, paymentTerms: { defaultVisible: false },
            preparer: { defaultVisible: false }, requisitionType: { defaultVisible: false }, project: { defaultVisible: false },
            returnedQuantity: { defaultVisible: false }, stockInDate: { defaultVisible: false }, stockInQuantity: { defaultVisible: false },
            returnedStockQuantity: { defaultVisible: false }, replenishmentQuantity: { defaultVisible: false },
            unexecutedCloseQuantity: { defaultVisible: false }, requisitionLineClosed: { defaultVisible: false },
            sourceDocumentNo: { defaultVisible: false }, sourceDocumentLineNo: { defaultVisible: false }, lineRemark: { defaultVisible: false },
            requisitionQuantity: { defaultVisible: false }, orderedQuantity: { defaultVisible: false }, demandDate: { defaultVisible: false },
            suggestedOrderDate: { defaultVisible: false }, customer: { defaultVisible: false },
          } },
          loading: orderLoading,
          page: orderPage, pageSize: orderPageSize,
          onPageChange: page => void loadOrders(page), onPageSizeChange: pageSize => { setOrderPageSize(pageSize); void loadOrders(1, pageSize) }, total: orderCount,
          onQueryChange: updateOrderTableQuery, queryFieldIds: ORDER_QUERY_FIELD_IDS,
          getRowId: row => row.id, rowSelection: orderSelection,
          onRowSelectionChange: selection => setOrderSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
          leadingColumns: [orderSelectColumn], additionalColumns: [orderActionColumn], emptyText: emptyStateContent('没有匹配的采购订单', '请调整筛选条件后重试。', { compact: true }),
        })))
}

module.exports = { renderOrdersView }
