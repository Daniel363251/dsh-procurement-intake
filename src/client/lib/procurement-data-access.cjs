function dataAccess(ctx) {
  const proc = () => ctx.get('remote.procurement')
  const unwrap = async (promise) => {
    const result = await promise
    if (!result.ok) {
      const error = result.error
      const message = error instanceof Error ? error.message : (typeof error === 'string' ? error : (error && error.message) ? error.message : String(error))
      console.error('[procurement] remote error:', error)
      throw new Error(message || '操作失败')
    }
    return result.value
  }
  return {
    list: (status, page, pageSize, sort, filters, keywords) => unwrap(proc().list({ status, page, pageSize, sort, filters, keywords })),
    listPurchaseOrders: (page, pageSize, sort, filters) => unwrap(proc().listPurchaseOrders({ page, pageSize, sort, filters })),
    workspaceSummary: (days) => unwrap(proc().workspaceSummary({ days })),
    setWorkspaceTodosRead: (ids, isRead) => unwrap(proc().setWorkspaceTodosRead({ ids, isRead })),
    updatePurchaseOrder: (id, updates) => unwrap(proc().updatePurchaseOrder({ id, ...updates })),
    importPurchaseOrders: (orders) => unwrap(proc().importPurchaseOrders({ orders })),
    deletePurchaseOrders: (ids) => unwrap(proc().deletePurchaseOrders({ ids })),
    cancelPurchaseOrders: (ids) => unwrap(proc().cancelPurchaseOrders({ ids })),
    notifyPurchaseOrders: (ids) => unwrap(proc().notifyPurchaseOrders({ ids })),
    syncOwnedPurchaseOrderNumbers: () => unwrap(proc().syncOwnedPurchaseOrderNumbers({})),
    claim: (ids) => unwrap(proc().claim({ ids })),
    importLines: (lines, fileName, sheetName) => unwrap(proc().importLines({ lines, fileName, sheetName })),
    clearPending: () => unwrap(proc().clearPending({})),
    deleteOwned: (ids) => unwrap(proc().deleteOwned({ ids })),
    updateLine: (id, updates) => unwrap(proc().updateLine({ id, ...updates })),
    updateSuppliers: (ids, supplier) => unwrap(proc().updateSuppliers({ ids, supplier })),
    aiGenerate: (operation, payload, sessionId) => unwrap(proc().aiGenerate({ operation, payload, sessionId })),
    listModelOptions: () => unwrap(proc().listModelOptions({})),
    getModelSettings: () => unwrap(proc().getModelSettings({})),
    updateModelSettings: (model, reasoningEffort) => unwrap(proc().updateModelSettings({ model, reasoningEffort })),
    listMasterData: type => unwrap(proc().listMasterData({ type })),
    saveMasterData: (type, value) => unwrap(proc().saveMasterData({ type, ...value })),
    setMasterDataStatus: (type, ids, status) => unwrap(proc().setMasterDataStatus({ type, ids, status })),
    deleteMasterData: (type, ids) => unwrap(proc().deleteMasterData({ type, ids })),
  }
}

module.exports = { dataAccess }
