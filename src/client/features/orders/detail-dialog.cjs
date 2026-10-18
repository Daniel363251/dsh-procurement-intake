const React = require('react')
const {
  Select: HildaSelect,
  SelectTrigger: HildaSelectTrigger,
  SelectValue: HildaSelectValue,
  SelectContent: HildaSelectContent,
  SelectItem: HildaSelectItem,
} = require('../../../../vendor/hilda-ui/components/Select.tsx')
const h = React.createElement

function renderOrderDetailDialog({
  t, orderDetailRow, orderDetailDraft, editingOrderDetails, savingOrderDetails,
  setOrderDetailRow, setOrderDetailDraft, setEditingOrderDetails, saveOrderDetails,
  selectPortalRef, detailValue, formatDateTime, copyCell, uniqueOrderItemValues, orderDraftFrom,
}) {
  const orderTermGroups = orderDetailRow ? (() => {
    const clauses = Array.isArray(orderDetailRow.clauses) ? orderDetailRow.clauses : []
    const definitions = [
      { section: '付款', label: t('paymentTerms'), fallback: orderDetailRow.paymentTerms || [] },
      { section: '交付', label: t('deliveryTermsGroup'), fallback: [] },
      { section: '其他约定', label: t('otherTerms'), fallback: orderDetailRow.otherTerms || [] },
    ]
    return definitions.map(group => {
      const sourceItems = clauses.length ? clauses.filter(item => item.section === group.section).map(item => item.text) : group.fallback
      const seen = new Set()
      const items = sourceItems.filter(item => {
        if (!item) return false
        const key = String(item).trim()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return { ...group, items }
    }).filter(group => group.items.length)
  })() : []
  const orderDraftInput = (label, field, type = 'text', wide = false) => h('label', { className: `pi-detail-field${wide ? ' pi-detail-field--wide' : ''}`, key: field },
    h('span', null, label), h('input', {
      className: 'pi-input pi-detail-input', type, step: type === 'number' ? 'any' : undefined,
      value: orderDetailDraft?.[field] ?? '', disabled: savingOrderDetails,
      onChange: event => setOrderDetailDraft(current => ({ ...current, [field]: event.target.value })),
    }))
  const orderInformationContent = orderDetailRow && (editingOrderDetails
    ? h(React.Fragment, null,
      h('div', { className: 'pi-detail-form' },
        orderDraftInput(t('orderNo'), 'orderNo'),
        h('label', { className: 'pi-detail-field' }, h('span', null, t('purchaseOrderStatus')),
          h(HildaSelect, { items: [
            { value: '待通知供应商', label: t('pendingVendorNotice') },
            { value: '已通知供应商', label: t('vendorNotified') },
            { value: '取消了采购订单', label: t('purchaseOrderCancelled') },
          ], value: orderDetailDraft?.purchaseOrderStatus || '待通知供应商', onValueChange: value => setOrderDetailDraft(current => ({ ...current, purchaseOrderStatus: value })), 'aria-label': t('purchaseOrderStatus') },
          h(HildaSelectTrigger, { className: 'pi-detail-select' }, h(HildaSelectValue)),
          h(HildaSelectContent, { portalContainer: selectPortalRef.current },
            h(HildaSelectItem, { value: '待通知供应商' }, t('pendingVendorNotice')),
            h(HildaSelectItem, { value: '已通知供应商' }, t('vendorNotified')),
            h(HildaSelectItem, { value: '取消了采购订单' }, t('purchaseOrderCancelled'))))),
        orderDraftInput(t('orderDateLabel'), 'orderDate', 'date'),
        orderDraftInput(t('procurementOrg'), 'procurementOrg'),
        orderDraftInput(t('inventoryOrg'), 'inventoryOrg'),
        orderDraftInput(t('supplier'), 'supplier'),
        orderDraftInput(t('requisitionType'), 'requisitionType'),
        orderDraftInput(t('preparer'), 'preparer'),
        orderDraftInput(t('procurementOfficer'), 'procurementOfficer'),
        orderDraftInput(t('procurementDepartment'), 'procurementDepartment'),
        orderDraftInput(t('project'), 'project'),
        orderDraftInput(t('orderTotal'), 'taxInclusiveTotal', 'number'),
        orderDraftInput(t('taxExclusiveTotal'), 'taxExclusiveTotal', 'number'),
        orderDraftInput(t('taxRate'), 'taxRate'),
        orderDraftInput(t('deliveryAddressLabel'), 'deliveryAddress'),
        orderDraftInput(t('recipient'), 'recipient'),
        orderDraftInput(t('recipientPhone'), 'recipientPhone'),
        orderDraftInput(t('deliveryTime'), 'deliveryTime', 'date')),
      h('p', { className: 'pi-help' }, `${t('requisitionNos')}：${(orderDetailRow.requisitionNos || []).join('、') || uniqueOrderItemValues(orderDetailRow, 'requisitionNo') || '—'}。${t('requisitionNumbersReadOnly')}`))
    : h('div', { className: 'pi-detail-grid' },
      detailValue(t('orderNo'), copyCell(orderDetailRow.orderNo, t('orderNo'), true)), detailValue(t('purchaseOrderStatus'), orderDetailRow.purchaseOrderStatus || t('pendingVendorNotice')), detailValue(t('orderDateLabel'), orderDetailRow.orderDate),
      detailValue(t('requisitionNos'), copyCell((orderDetailRow.requisitionNos || []).join('、') || uniqueOrderItemValues(orderDetailRow, 'requisitionNo'), t('requisitionNos'), true)),
      detailValue(t('procurementOrg'), copyCell(orderDetailRow.procurementOrg || orderDetailRow.buyer, t('procurementOrg'), true)),
      detailValue(t('inventoryOrg'), orderDetailRow.inventoryOrg || uniqueOrderItemValues(orderDetailRow, 'inventoryOrg')),
      detailValue(t('supplier'), copyCell(orderDetailRow.supplier, t('supplier'), true)), detailValue(t('requisitionType'), orderDetailRow.requisitionType),
      detailValue(t('preparer'), orderDetailRow.preparer), detailValue(t('procurementOfficer'), orderDetailRow.procurementOfficer),
      detailValue(t('procurementDepartment'), orderDetailRow.procurementDepartment), detailValue(t('project'), orderDetailRow.project),
      detailValue(t('orderTotal'), orderDetailRow.taxInclusiveTotal == null ? '' : Number(orderDetailRow.taxInclusiveTotal).toLocaleString()),
      detailValue(t('taxExclusiveTotal'), orderDetailRow.taxExclusiveTotal == null ? '' : Number(orderDetailRow.taxExclusiveTotal).toLocaleString()),
      detailValue(t('taxRate'), orderDetailRow.taxRate), detailValue(t('deliveryAddressLabel'), orderDetailRow.deliveryAddress),
      detailValue(t('recipient'), orderDetailRow.recipient), detailValue(t('recipientPhone'), orderDetailRow.recipientPhone),
      detailValue(t('deliveryTime'), orderDetailRow.deliveryTime), detailValue(t('sourceFile'), orderDetailRow.sourceFileName),
      detailValue(t('importedAt'), formatDateTime(orderDetailRow.importedAt))))
  const orderDetailDialog = orderDetailRow && h('div', { className: 'pi-drawer-overlay', onClick: event => { if (event.target === event.currentTarget && !savingOrderDetails) { setOrderDetailRow(null); setEditingOrderDetails(false) } } },
    h('div', { className: 'pi-drawer-panel pi-detail-dialog pi-order-detail-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${t('orderDetails')} ${orderDetailRow.orderNo}` },
      h('div', { className: 'pi-detail-heading' }, h('div', null, h('h3', { className: 'pi-dialog-title' }, t('orderDetails')), h('p', { className: 'pi-dialog-description' }, orderDetailRow.orderNo)),
        h('div', { className: 'pi-order-detail-heading-actions' }, editingOrderDetails ? h(React.Fragment, null,
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingOrderDetails, onClick: () => { setOrderDetailDraft(orderDraftFrom(orderDetailRow)); setEditingOrderDetails(false) } }, t('discardChanges')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', disabled: savingOrderDetails, onClick: saveOrderDetails }, savingOrderDetails ? t('saving') : t('saveOrderInfo')))
          : h(React.Fragment, null,
            h('button', { type: 'button', className: 'pi-button pi-button--small', onClick: () => setEditingOrderDetails(true) }, t('editOrderInfo')),
            h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingOrderDetails, onClick: () => { setOrderDetailRow(null); setEditingOrderDetails(false) } }, t('close'))))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('orderInformation')),
        orderInformationContent),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, `${t('itemCount')} · ${orderDetailRow.items?.length || 0}`),
        h('div', { className: 'pi-order-detail-items-wrap' }, h('table', { className: 'pi-table pi-order-detail-items' },
          h('thead', null, h('tr', null, ...[t('orderItemSequence'), t('requisitionNos'), t('materialCode'), t('orderItems'), t('spec'), t('requisitionQuantity'), t('demandDate'), t('suggestedOrderDate'), t('orderedQuantity'), t('unitLabel'), t('expectedArrivalDate'), t('arrivalDate'), t('receivedQuantity'), t('returnedQuantity'), t('remainingQuantity'), t('stockInDate'), t('stockInQuantity'), t('returnedStockQuantity'), t('replenishmentQuantity'), t('unexecutedCloseQuantity'), t('customer'), t('materialCategory'), t('procurementOrg'), t('procurementOfficer'), t('procurementDepartment'), t('sourceDocumentNo'), t('sourceDocumentLineNo'), t('requisitionLineClosed'), t('lineRemark'), t('unitPrice'), t('lineAmount')].map(label => h('th', { key: label }, label)))),
          h('tbody', null, ...(orderDetailRow.items || []).map((item, index) => h('tr', { key: `${item.sequence || index}:${item.requisitionNo || item.name}` },
            h('td', null, item.sequence || index + 1), h('td', null, copyCell(item.requisitionNo, t('requisitionNo'))), h('td', null, copyCell(item.materialCode, t('materialCode'))),
            h('td', null, copyCell(item.name, t('material'))), h('td', null, item.specification || '—'),
            h('td', null, item.requisitionQuantity ?? '—'), h('td', null, item.demandDate || '—'), h('td', null, item.suggestedOrderDate || '—'),
            h('td', null, item.orderedQuantity ?? item.quantity ?? '—'), h('td', null, item.unit || '—'),
            h('td', null, item.expectedArrivalDate || '—'), h('td', null, item.arrivalDate || '—'),
            h('td', null, item.receivedQuantity ?? '—'), h('td', null, item.returnedQuantity ?? '—'), h('td', null, item.remainingQuantity ?? '—'),
            h('td', null, item.stockInDate || '—'), h('td', null, item.stockInQuantity ?? '—'), h('td', null, item.returnedStockQuantity ?? '—'),
            h('td', null, item.replenishmentQuantity ?? '—'), h('td', null, item.unexecutedCloseQuantity ?? '—'), h('td', null, item.customer || '—'), h('td', null, item.materialCategory || '—'),
            h('td', null, copyCell(item.procurementOrg, t('procurementOrg'))), h('td', null, item.procurementOfficer || '—'), h('td', null, item.procurementDepartment || '—'),
            h('td', null, item.sourceDocumentNo || '—'), h('td', null, item.sourceDocumentLineNo || '—'),
            h('td', null, item.requisitionLineClosed || '—'), h('td', null, item.lineRemark || '—'),
            h('td', null, item.taxInclusiveUnitPrice == null ? '—' : Number(item.taxInclusiveUnitPrice).toLocaleString()),
            h('td', null, item.amount == null ? '—' : Number(item.amount).toLocaleString()))))))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('orderTerms')),
        orderTermGroups.length ? h('div', { className: 'pi-order-detail-terms' }, ...orderTermGroups.map(group => h('section', { className: 'pi-order-detail-term-group', key: group.section },
          h('h5', null, group.label), h('ol', null, ...group.items.map((item, index) => h('li', { key: `${group.section}:${index}` }, item)))))) : h('p', { className: 'pi-help' }, t('notRecorded'))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('activityHistory')),
        orderDetailRow.activityLog?.length ? h('div', { className: 'pi-detail-history' }, ...[...orderDetailRow.activityLog].slice(-8).reverse().map(item => h('article', { className: 'pi-detail-history-item', key: item.id }, h('strong', null, item.action), h('span', null, formatDateTime(item.createdAt)), h('p', null, item.detail)))) : h('p', { className: 'pi-help' }, t('noOperationHistory'))),
      h('div', { className: 'pi-dialog-actions' }, h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingOrderDetails, onClick: () => { setOrderDetailRow(null); setEditingOrderDetails(false) } }, t('close')))))
  return orderDetailDialog
}

module.exports = { renderOrderDetailDialog }
