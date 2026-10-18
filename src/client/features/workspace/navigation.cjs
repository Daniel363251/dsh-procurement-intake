function createWorkspaceNavigation({
  setMenu, setOrderView, setOrderDetailRow, setOrderDetailDraft, orderDraftFrom,
  setEditingOrderDetails, setRequestView, openDetails,
}) {
  function openWorkspaceRecord(item) {
    if (item.type === 'order') {
      setMenu('orders')
      setOrderView('manage')
      setOrderDetailRow(item.entity)
      setOrderDetailDraft(orderDraftFrom(item.entity))
      setEditingOrderDetails(false)
    } else {
      setMenu('requests')
      setRequestView('mine')
      openDetails(item.entity)
    }
  }

  function navigateWorkspaceMetric(target) {
    if (target === 'orders') {
      setMenu('orders')
      setOrderView('manage')
    } else {
      setMenu('requests')
      setRequestView(target === 'mine' || target === 'unmatched' ? 'mine' : 'intake')
    }
  }

  return { openWorkspaceRecord, navigateWorkspaceMetric }
}

module.exports = { createWorkspaceNavigation }
