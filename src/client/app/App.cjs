const React = require('react')
const { RefreshCw, Copy, LayoutDashboard, ClipboardList, PackageCheck, TriangleAlert, Settings2, Database } = require('lucide-react')
const h = React.createElement
const { aiTableCSS, hildaUiCSS, copyCellCSS, masterDataCSS, hoverTooltipCSS, tableStickyCSS, interactionFixCSS, workspaceCSS, orderLayoutCSS, css } = require('../styles.cjs')
function text(value) { return value == null ? '' : String(value).trim() }
function normalize(value) { return text(value).replace(/[\s\u00a0]/g, '').toLowerCase() }
const EMPTY_STATE_IMAGE = __EMPTY_STATE_IMAGE__
const PLUGIN_ICON = __PLUGIN_ICON__
function PluginGuideIcon({ size = 24, className }) {
  return h('img', { src: PLUGIN_ICON, alt: '', width: size, height: size, className, style: { objectFit: 'contain', borderRadius: 4 } })
}
function emptyStateContent(title, description, { compact = false, action = null } = {}) {
  return h('div', { className: `pi-empty-state-content${compact ? ' is-compact' : ''}` },
    h('img', { className: 'pi-empty-state-illustration', src: EMPTY_STATE_IMAGE, alt: '' }),
    h('div', { className: 'pi-empty-state-copy' },
      h('strong', null, title),
      description ? h('p', null, description) : null,
      action))
}
const { renderRowActionMenu } = require('../components/row-action-menu.cjs')
const { createAiAdapter } = require('../lib/ai-adapter.cjs')
const { useTruncatedCellTooltip } = require('../hooks/use-truncated-cell-tooltip.cjs')
const {
  uniqueOrderItemValues, sumOrderItemValues, qty, lineCard,
  formatDateTime, detailValue,
} = require('../components/presentation.cjs')

const { PENDING_QUERY_FIELD_IDS, MINE_QUERY_FIELD_IDS, MINE_COLUMN_SETTINGS_KEY } = require('../features/requisitions/table-config.cjs')
const { ORDER_QUERY_FIELD_IDS, ORDER_COLUMN_SETTINGS_KEY, ORDER_REPORT_VISIBLE_COLUMNS, ORDER_REPORT_HIDDEN_LEGACY_COLUMNS } = require('../features/orders/table-config.cjs')
const { renderOrdersView } = require('../features/orders/view.cjs')
const { renderMasterDataView } = require('../features/master-data/view.cjs')
const { useMasterData } = require('../features/master-data/use-master-data.cjs')
const { useMasterDataTableViews } = require('../features/master-data/table-views.cjs')
const { useOrderTableViews } = require('../features/orders/table-views.cjs')
const { useOrders } = require('../features/orders/use-orders.cjs')
const { useRequisitions } = require('../features/requisitions/use-requisitions.cjs')
const { renderRequisitionImportViews } = require('../features/imports/requisition-view.cjs')
const { renderOrderDetailDialog } = require('../features/orders/detail-dialog.cjs')
const { renderSettingsView } = require('../features/settings/view.cjs')
const { useModelSettings } = require('../features/settings/use-model-settings.cjs')
const { renderWorkspaceView } = require('../features/workspace/view.cjs')
const { useWorkspace } = require('../features/workspace/use-workspace.cjs')
const { createWorkspaceNavigation } = require('../features/workspace/navigation.cjs')
const { getRouteTitle, getRouteContent } = require('./routes.cjs')
const { useRequisitionTableViews } = require('../features/requisitions/table-views.cjs')
const { renderRequisitionDialogs } = require('../features/requisitions/dialogs.cjs')

class IntakeErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[procurement] render error:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const message = this.state.error instanceof Error ? this.state.error.message : String(this.state.error)
    return h('main', { className: 'pc-intake' },
      h('section', { className: 'pi-card pi-error-screen', role: 'alert' },
        h('h1', { className: 'pi-title' }, '采购工作台暂时无法显示'),
        h('p', { className: 'pi-help' }, '插件捕获到界面异常，详细信息已写入浏览器 Console。可以尝试重新载入此区域。'),
        h('pre', { className: 'pi-error-detail' }, message),
        h('button', { type: 'button', className: 'pi-button', onClick: () => this.setState({ error: null }) }, '重新载入')))
  }
}

function IntakeBody({ t, data, sessionId }) {
  const selectPortalRef = React.useRef(null)
  useTruncatedCellTooltip(selectPortalRef)
  React.useLayoutEffect(() => {
    try {
      const saved = window.localStorage.getItem(MINE_COLUMN_SETTINGS_KEY)
      if (!saved) return
      const state = JSON.parse(saved)
      if (!state || !Array.isArray(state.visible) || state.visible.includes('procurementOrg')) return
      const order = Array.isArray(state.order) ? [...state.order] : []
      if (!order.includes('procurementOrg')) {
        const requisitionIndex = order.indexOf('requisitionNo')
        order.splice(requisitionIndex >= 0 ? requisitionIndex + 1 : order.length, 0, 'procurementOrg')
      }
      window.localStorage.setItem(MINE_COLUMN_SETTINGS_KEY, JSON.stringify({ ...state, order, visible: [...state.visible, 'procurementOrg'] }))
    } catch {}
  }, [])
  React.useLayoutEffect(() => {
    try {
      const saved = window.localStorage.getItem(ORDER_COLUMN_SETTINGS_KEY)
      if (!saved) return
      const state = JSON.parse(saved)
      if (!state || !Array.isArray(state.visible) || state.procurementExecutionColumnsVersion >= 1) return
      const order = Array.isArray(state.order) ? [...state.order] : []
      let insertionIndex = order.indexOf('orderNo') + 1
      if (insertionIndex === 0) insertionIndex = order.length
      const visible = new Set(state.visible)
      ORDER_REPORT_HIDDEN_LEGACY_COLUMNS.forEach(fieldId => visible.delete(fieldId))
      for (const fieldId of ORDER_REPORT_VISIBLE_COLUMNS) {
        if (!order.includes(fieldId)) order.splice(insertionIndex++, 0, fieldId)
        visible.add(fieldId)
      }
      window.localStorage.setItem(ORDER_COLUMN_SETTINGS_KEY, JSON.stringify({ ...state, order, visible: [...visible], procurementExecutionColumnsVersion: 1 }))
    } catch {}
  }, [])
  const [menu, setMenu] = React.useState('requests')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const {
    store, requestView, setRequestView, pendingPage, setPendingPage, minePage, setMinePage,
    pendingPageSize, minePageSize, pendingLoading, mineLoading, query, setQuery, fileName,
    sheets, sheetIndex, setSheetIndex, selected, setSelected, toggle, parsing, importing, dragActive,
    setDragActive, mineSelected, setMineSelected, toggleMine, shipDate, setShipDate, shipDialogOpen,
    setShipDialogOpen, batchNotesDialogOpen, setBatchNotesDialogOpen, batchNotesDraft,
    setBatchNotesDraft, savingBatchNotes, applyNotesToSelected,
    supplierDialogOpen, setSupplierDialogOpen, batchSupplierDraft,
    setBatchSupplierDraft, savingBatchSupplier, detailDialogOverlayRef, detailRow, setDetailRow,
    detailDraft, setDetailDraft, savingDetail, fileInputRef, listRequestIds, keywordRef,
    previousKeyword, pendingTableQuery, mineTableQuery, words, sheet, pending, mine, candidates,
    selectedCount, requisitionCount, loadPage, refresh, updateTableQuery, changePage,
    changePageSize, refreshTable, chooseFile, claim, doImport, clearPending, deleteOwned,
    openDetails, saveDetails, saveShip, applyShipToSelected, applySupplierToSelected, deleteSelected,
  } = useRequisitions({ data, t, setError, setSuccess })
  const { uploadSection, previewSection, searchSection, batchSection } = renderRequisitionImportViews({
    t, h, store, parsing, importing, dragActive, setDragActive, fileInputRef, fileName, sheets, sheetIndex,
    setSheetIndex, sheet, chooseFile, doImport, lineCard, query, setQuery, keywordRef, candidates, selectedCount,
    requisitionCount, selected,
    clearPending, claim,
  })
  const {
    workspaceSummary, workspaceLoading, workspaceError, workspaceTodoDialogOpen,
    workspaceTodoSaving, setWorkspaceTodoDialogOpen, loadWorkspaceSummary, setWorkspaceTodoRead,
  } = useWorkspace({ data, t, menu })
  React.useEffect(() => {
    if (!success) return
    const timer = window.setTimeout(() => setSuccess(''), 4000)
    return () => window.clearTimeout(timer)
  }, [success])
  const {
    masterDataType, setMasterDataType, masterDataRows, setMasterDataRows, masterDataSelected,
    setMasterDataSelected, masterDataLoading, masterDataOverviewCount, setMasterDataOverviewCount,
    masterDataOverviewLoading, masterDataSaving, masterDataDraft, setMasterDataDraft,
    refreshMasterData, refreshMasterDataOverview, openMasterDataType, saveMasterRecord,
    changeMasterDataStatus, deleteMasterRecords,
  } = useMasterData({ data, t, menu, setError, setSuccess })
  const { modelOptions, modelSettings, setModelSettings, saveModelSettings } = useModelSettings({ data, t, setError, setSuccess })
  const copyText = async rawValue => {
    const value = rawValue == null ? '' : String(rawValue).trim()
    if (!value || value === '—') return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const input = document.createElement('textarea')
        input.value = value
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        const copied = document.execCommand('copy')
        input.remove()
        if (!copied) throw new Error('Clipboard copy was rejected')
      }
      setError('')
      setSuccess('')
      window.requestAnimationFrame(() => setSuccess(t('copySuccess')))
    } catch (copyError) {
      setError(t('copyFailed'))
    }
  }
  const copyCell = (rawValue, label, detail = false) => {
    const value = Array.isArray(rawValue) ? rawValue.filter(Boolean).join('、') : rawValue == null ? '' : String(rawValue).trim()
    if (!value || value === '—') return h('span', { className: 'pi-cell pi-cell--muted' }, '—')
    return h('button', {
      type: 'button',
      className: `pi-copy-cell${detail ? ' pi-detail-copy-cell' : ''}`,
      'aria-label': `${t('copy')} ${label}: ${value}`,
      onClick: event => { event.stopPropagation(); void copyText(value) },
    }, h(Copy, { size: 14, strokeWidth: 1.8, className: 'pi-copy-cell-icon', 'aria-hidden': true }), h('span', { className: 'pi-copy-cell-text' }, value))
  }

  const {
    orderRows, orderCount, orderView, setOrderView, orderPage, orderPageSize, setOrderPageSize,
    orderLoading, notifyingOrders, syncingPurchaseOrders, orderSelected, setOrderSelected, orderParsing, orderImporting,
    orderDetailRow, setOrderDetailRow, orderDetailDraft, setOrderDetailDraft, editingOrderDetails,
    setEditingOrderDetails, savingOrderDetails, orderPreview, orderPreviewSelected,
    setOrderPreviewSelected, orderFileErrors, orderDuplicateCount, orderSkippedRows,
    orderFileInputRef, loadOrders, orderDraftFrom, openOrderDetails, saveOrderDetails,
    chooseOrderFiles, importOrders, deleteOrders, cancelOrder, notifySelectedOrders,
    syncPurchaseOrderNumbers, updateOrderTableQuery,
  } = useOrders({ data, t, menu, setError, setSuccess, loadPage, refresh, minePage, minePageSize, normalize })
  const tableRefreshButton = (onClick, loading) => h('button', {
    type: 'button', className: 'pi-button pi-button--small', style: { marginLeft: 'auto' },
    disabled: loading, onClick, 'aria-label': t('refreshDashboard'),
  }, h(RefreshCw, { size: 15, strokeWidth: 2, 'aria-hidden': true }), t('refreshDashboard'))
  const aiAdapter = React.useMemo(() => createAiAdapter(data, sessionId), [data, sessionId])
  const { pendingDefinition, pendingSelection, pendingSelectColumn, candidateSection, mineDefinition, mineSelection, mineSelectColumn, mineActionColumn, mineSection } = useRequisitionTableViews({
    t, aiAdapter, pending, query, words, store, selected, setSelected, toggle, candidates, pendingLoading, pendingPage,
    pendingPageSize, refreshTable, tableRefreshButton, changePage, changePageSize, updateTableQuery,
    PENDING_QUERY_FIELD_IDS, emptyStateContent, mine, mineSelected, setMineSelected, toggleMine,
    MINE_COLUMN_SETTINGS_KEY, MINE_QUERY_FIELD_IDS, setBatchNotesDraft, setBatchNotesDialogOpen,
    setBatchSupplierDraft, setSupplierDialogOpen,
    setShipDialogOpen, deleteSelected, deleteOwned, openDetails, mineLoading, minePage, minePageSize, copyCell, qty, formatDateTime,
  })

  const placeholder = h('section', { className: 'pi-card pi-empty' }, emptyStateContent(getRouteTitle(menu, t), t('comingSoon')))
  const { orderDefinition, orderSelection, orderSelectColumn, orderActionColumn } = useOrderTableViews({
    t, aiAdapter, copyCell, uniqueOrderItemValues, sumOrderItemValues, formatDateTime, orderSelected,
    setOrderSelected, renderRowActionMenu, openOrderDetails, deleteOrders, cancelOrder,
  })
  const { masterDataDefinition, masterDataSelection, masterDataSelectColumn, masterDataActionColumn } = useMasterDataTableViews({
    t, aiAdapter, masterDataType, masterDataSelected, setMasterDataSelected, renderRowActionMenu,
    setMasterDataDraft, changeMasterDataStatus, deleteMasterRecords, formatDateTime,
  })
  const { section: masterDataSection, editDrawer: masterDataEditDrawer } = renderMasterDataView({
    t, masterDataType, masterDataOverviewLoading, masterDataOverviewCount, masterDataLoading, masterDataRows,
    masterDataSelected, masterDataSelection, masterDataDefinition, masterDataSelectColumn, masterDataActionColumn,
    masterDataDraft, masterDataSaving, setMasterDataType, setMasterDataRows, setMasterDataDraft,
    setMasterDataSelected, setMasterDataOverviewCount, openMasterDataType, changeMasterDataStatus,
    deleteMasterRecords, refreshMasterData, saveMasterRecord, tableRefreshButton, emptyStateContent,
  })
  const orderSection = renderOrdersView({
    t, orderView, orderCount, parsing: orderParsing, importing: orderImporting, orderFileInputRef, chooseOrderFiles, orderFileErrors,
    orderSkippedRows, orderPreview, orderPreviewSelected, setOrderPreviewSelected, importOrders,
    syncingPurchaseOrders, notifyingOrders, syncPurchaseOrderNumbers, notifySelectedOrders, orderSelected,
    deleteOrders, loadOrders, orderPage, orderLoading, setOrderView, emptyStateContent, orderDefinition,
    orderRows, ORDER_COLUMN_SETTINGS_KEY, orderPageSize, setOrderPageSize, updateOrderTableQuery,
    ORDER_QUERY_FIELD_IDS, orderSelection, setOrderSelected, orderSelectColumn, orderActionColumn,
    sumOrderItemValues, normalize, tableRefreshButton,
  })
  const settingsSection = renderSettingsView({ t, modelOptions, modelSettings, setModelSettings, saveModelSettings, selectPortalRef })

  const { openWorkspaceRecord, navigateWorkspaceMetric } = createWorkspaceNavigation({
    setMenu, setOrderView, setOrderDetailRow, setOrderDetailDraft, orderDraftFrom,
    setEditingOrderDetails, setRequestView, openDetails,
  })
  const { section: dashboardSection, todoDialog: dashboardTodoDialog } = renderWorkspaceView({
    t, workspaceSummary, workspaceLoading, workspaceError, workspaceTodoDialogOpen, workspaceTodoSaving,
    setWorkspaceTodoDialogOpen, setWorkspaceTodoRead, loadWorkspaceSummary, emptyStateContent,
    openWorkspaceRecord, navigateWorkspaceMetric,
  })

  const { detailDialog, shipDialog, supplierDialog, batchNotesDialog } = renderRequisitionDialogs({
    t, detailDialogOverlayRef, detailRow, detailDraft, savingDetail, setDetailRow, setDetailDraft,
    saveDetails, detailValue, copyCell, qty, formatDateTime, shipDialogOpen, setShipDialogOpen,
    mineSelected, shipDate, setShipDate, applyShipToSelected, supplierDialogOpen, savingBatchSupplier,
    setSupplierDialogOpen, batchSupplierDraft, setBatchSupplierDraft, applySupplierToSelected,
    batchNotesDialogOpen, setBatchNotesDialogOpen, batchNotesDraft, setBatchNotesDraft,
    savingBatchNotes, applyNotesToSelected,
  })
  const orderDetailDialog = renderOrderDetailDialog({
    t, orderDetailRow, orderDetailDraft, editingOrderDetails, savingOrderDetails, setOrderDetailRow,
    setOrderDetailDraft, setEditingOrderDetails, saveOrderDetails, selectPortalRef, detailValue,
    formatDateTime, copyCell, uniqueOrderItemValues, orderDraftFrom,
  })
  return h('main', { ref: selectPortalRef, className: 'pc-intake' }, h('style', null, css + hildaUiCSS + aiTableCSS + copyCellCSS + masterDataCSS + hoverTooltipCSS + workspaceCSS + tableStickyCSS + interactionFixCSS + orderLayoutCSS), h('div', { className: 'pi-stack' },
    h('nav', { className: 'pi-menu', 'aria-label': t('category') }, ...[
      ['workspace', t('workspace'), LayoutDashboard], ['requests', t('requests'), ClipboardList],
      ['orders', t('ordersMenu'), PackageCheck], ['issues', t('issues'), TriangleAlert],
      ['settings', t('modelSettings'), Settings2], ['masterData', t('masterData'), Database],
    ].map(([key, label, Icon]) => h('button', { key, type: 'button', className: 'pi-menu-item', onClick: () => { if (key === 'masterData') { setMasterDataType(null); setMasterDataRows([]); setMasterDataDraft(null); setMasterDataSelected(new Set()); setMasterDataOverviewCount(null) } setMenu(key) }, 'aria-current': menu === key ? 'page' : undefined }, h(Icon, { 'aria-hidden': true }), h('span', null, label)))),
    success && h('div', { className: 'cn-toast', role: 'status', 'aria-live': 'polite' },
      h('span', { className: 'cn-toast-mark', 'aria-hidden': true }, '✓'),
      h('div', { className: 'cn-toast-copy' }, h('strong', null, success)),
      h('button', { type: 'button', className: 'cn-button cn-button-variant-ghost cn-button-size-icon', 'aria-label': t('close'), onClick: () => setSuccess('') }, '×')),
    error && h('p', { className: 'pi-error', role: 'alert' }, error),
    menu === 'requests' && h('nav', { className: 'pi-tabs', 'aria-label': t('requests') }, ...[['intake', `${t('pendingTab')} · ${store.pendingTotal}`], ['mine', `${t('mineTab')} · ${store.mineTotal}`]].map(([key, label]) => h('button', { key, type: 'button', className: 'pi-tab', onClick: () => setRequestView(key), 'aria-pressed': requestView === key }, label))),
    menu === 'orders' && h('nav', { className: 'pi-tabs', 'aria-label': t('ordersMenu') }, ...[['import', t('orderImportTab')], ['manage', `${t('orderManageTab')} · ${orderCount}`]].map(([key, label]) => h('button', { key, type: 'button', className: 'pi-tab', onClick: () => setOrderView(key), 'aria-pressed': orderView === key }, label))),
    ...getRouteContent({ menu, requestView, views: { uploadSection, previewSection, searchSection, batchSection, candidateSection, mineSection, orderSection, settingsSection, masterDataSection, dashboardSection, placeholder } }),
    h('p', { className: 'pi-footer' }, t('localStorageNote'))), shipDialog, detailDialog, orderDetailDialog, supplierDialog, batchNotesDialog, masterDataEditDrawer, dashboardTodoDialog)
}

module.exports = { IntakeErrorBoundary, IntakeBody, PluginGuideIcon }
