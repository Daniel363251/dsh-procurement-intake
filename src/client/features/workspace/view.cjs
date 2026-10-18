const React = require('react')
const { RefreshCw, Activity, TriangleAlert, Send, ClipboardList, PackageCheck, Unlink, Truck, ListTodo, Check } = require('lucide-react')
const { ChartContainer, ChartTooltipContent } = require('../../../../vendor/hilda-ui/components/Chart.tsx')
const { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } = require('recharts')
const h = React.createElement

function renderWorkspaceView({
  t, workspaceSummary, workspaceLoading, workspaceError, workspaceTodoDialogOpen,
  workspaceTodoSaving, setWorkspaceTodoDialogOpen, setWorkspaceTodoRead, loadWorkspaceSummary,
  emptyStateContent, openWorkspaceRecord, navigateWorkspaceMetric,
}) {
  const dashboardCounts = workspaceSummary?.counts || {}
  const dashboardTrend = workspaceSummary?.trend || []
  const dashboardHasTrend = dashboardTrend.some(item => item.requisitions || item.orders)
  const dashboardDate = value => {
    if (!value) return ''
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  }
  const dashboardMetrics = [
    { key: 'pending', label: t('metricPending'), value: dashboardCounts.pendingLines, icon: ClipboardList, target: 'pending' },
    { key: 'mine', label: t('metricMine'), value: dashboardCounts.ownedLines, icon: ListTodo, target: 'mine' },
    { key: 'orders', label: t('metricOrders'), value: dashboardCounts.purchaseOrders, icon: PackageCheck, target: 'orders' },
    { key: 'notice', label: t('metricWaitingNotice'), value: dashboardCounts.waitingVendorNotice, icon: Send, target: 'orders' },
    { key: 'unmatched', label: t('metricUnmatched'), value: dashboardCounts.unmatchedPurchaseOrders, icon: Unlink, target: 'unmatched' },
    { key: 'overdue', label: t('metricOverdue'), value: dashboardCounts.overdueDeliveries, icon: Truck, target: 'orders' },
  ]
  const chartConfig = {
    requisitions: { label: t('chartRequisitions'), color: 'var(--pc-color-primary)' },
    orders: { label: t('chartOrders'), color: 'var(--pc-color-info)' },
  }
  const dashboardChart = workspaceLoading && !workspaceSummary
    ? h('div', { className: 'pi-dashboard-empty', role: 'status' }, t('dashboardLoading'))
    : !dashboardHasTrend ? h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noTrend'), null, { compact: true }))
      : h(ChartContainer, { id: 'procurement-import-trend', className: 'pi-dashboard-chart', config: chartConfig },
        h(LineChart, { data: dashboardTrend, accessibilityLayer: true, margin: { left: 4, right: 8, top: 5, bottom: 0 } },
          h(CartesianGrid, { vertical: false, stroke: 'var(--pc-color-border-subtle)' }),
          h(XAxis, { dataKey: 'date', tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 24, tick: { fill: 'var(--pc-color-text-muted)', fontSize: 10 }, tickFormatter: value => String(value).slice(5) }),
          h(YAxis, { allowDecimals: false, width: 28, tickLine: false, axisLine: false, tick: { fill: 'var(--pc-color-text-muted)', fontSize: 10 } }),
          h(Tooltip, { content: h(ChartTooltipContent, { config: chartConfig, labelFormatter: value => dashboardDate(value) }) }),
          h(Legend, { verticalAlign: 'top', align: 'right', height: 22, iconType: 'circle', wrapperStyle: { fontSize: 10, color: 'var(--pc-color-text-secondary)' } }),
          h(Line, { type: 'monotone', dataKey: 'requisitions', name: t('chartRequisitions'), stroke: 'var(--color-requisitions)', strokeWidth: 2, dot: false, activeDot: { r: 4 } }),
          h(Line, { type: 'monotone', dataKey: 'orders', name: t('chartOrders'), stroke: 'var(--color-orders)', strokeWidth: 2, dot: false, activeDot: { r: 4 } })))
  const renderDashboardTodo = item => {
    const Icon = item.title === '预计到货已逾期' ? TriangleAlert : item.type === 'order' ? Send : ClipboardList
    return h('div', { className: `pi-dashboard-todo-row${item.isRead ? ' is-read' : ''}`, key: item.id },
      h('button', { type: 'button', className: 'pi-dashboard-todo-open', onClick: () => openWorkspaceRecord(item), 'aria-label': `${t('openRecord')}: ${item.title} · ${item.description}` },
        h('span', { className: 'pi-dashboard-row-icon' }, h(Icon, { 'aria-hidden': true })),
        h('span', { className: 'pi-dashboard-row-copy' }, h('strong', { className: 'pi-dashboard-row-title' }, item.title), h('small', { className: 'pi-dashboard-row-description' }, item.description)),
        item.dueDate && h('time', { className: 'pi-dashboard-row-time', dateTime: item.dueDate }, dashboardDate(item.dueDate))),
      h('button', { type: 'button', className: 'pi-dashboard-todo-read', disabled: workspaceTodoSaving.has(item.id), onClick: () => void setWorkspaceTodoRead(item.id, !item.isRead), 'aria-label': item.isRead ? t('markAsUnread') : t('markAsRead'), title: item.isRead ? t('markAsUnread') : t('markAsRead') },
        workspaceTodoSaving.has(item.id) ? h('span', { className: 'pi-spinner', 'aria-hidden': true }) : item.isRead ? h(Check, { 'aria-hidden': true }) : t('markAsRead')))
  }
  const dashboardTodos = workspaceSummary?.todos || []
  const dashboardTodoContent = workspaceLoading && !workspaceSummary
    ? h('div', { className: 'pi-dashboard-empty', role: 'status' }, t('dashboardLoading'))
    : dashboardTodos.length ? h('div', { className: 'pi-dashboard-list pi-dashboard-list--todo' }, ...dashboardTodos.slice(0, 5).map(renderDashboardTodo))
      : h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noTodos'), null, { compact: true }))
  const dashboardTodoDialog = workspaceTodoDialogOpen && h('div', { className: 'pi-dialog-overlay', onClick: event => { if (event.target === event.currentTarget) setWorkspaceTodoDialogOpen(false) } },
    h('section', { className: 'pi-dialog-panel pi-dashboard-todo-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('allTodos') },
      h('header', { className: 'pi-dashboard-todo-dialog-heading' },
        h('div', null, h('h3', null, t('allTodos')), h('p', null, t('todoCount').replace('{count}', String(dashboardTodos.length)))),
        h('button', { type: 'button', className: 'pi-button pi-button--small', onClick: () => setWorkspaceTodoDialogOpen(false) }, t('close'))),
      h('div', { className: 'pi-dashboard-todo-dialog-list' }, dashboardTodos.length
        ? h('div', { className: 'pi-dashboard-list pi-dashboard-list--todo' }, ...dashboardTodos.map(renderDashboardTodo))
        : h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noTodos'), null, { compact: true })))))
  const dashboardActivityContent = workspaceLoading && !workspaceSummary
    ? h('div', { className: 'pi-dashboard-empty', role: 'status' }, t('dashboardLoading'))
    : workspaceSummary?.recentActivity?.length ? h('div', { className: 'pi-dashboard-activity' }, ...workspaceSummary.recentActivity.map(item =>
      h('button', { type: 'button', className: 'pi-dashboard-row', key: item.id, onClick: () => openWorkspaceRecord(item), 'aria-label': `${item.title} · ${item.recordNo}` },
        h('span', { className: 'pi-dashboard-row-icon' }, h(Activity, { 'aria-hidden': true })),
        h('span', { className: 'pi-dashboard-row-copy' }, h('strong', { className: 'pi-dashboard-row-title' }, item.title), h('small', { className: 'pi-dashboard-row-description' }, `${item.recordNo || t(item.type === 'order' ? 'dashboardOrder' : 'dashboardRequest')}${item.detail ? ` · ${item.detail}` : ''}`)),
        h('time', { className: 'pi-dashboard-row-time', dateTime: item.createdAt }, dashboardDate(item.createdAt)))))
      : h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noActivity'), null, { compact: true }))
  const dashboardSection = h('section', { className: 'pi-dashboard', 'aria-label': t('dashboardTitle') },
    h('header', { className: 'pi-dashboard-heading' },
      h('div', null, h('h1', null, t('dashboardTitle')), h('p', null, t('dashboardSubtitle'))),
      h('button', { type: 'button', className: `pi-button pi-button--small pi-dashboard-refresh${workspaceLoading ? ' is-loading' : ''}`, disabled: workspaceLoading, onClick: () => void loadWorkspaceSummary(), 'aria-label': t('refreshDashboard') },
        h(RefreshCw, { 'aria-hidden': true }), h('span', null, workspaceLoading ? t('dashboardLoading') : t('refreshDashboard')))),
    workspaceError && h('p', { className: 'pi-error', role: 'alert' }, workspaceError),
    h('div', { className: 'pi-dashboard-metrics' }, ...dashboardMetrics.map(metric => {
      const Icon = metric.icon
      return h('button', { type: 'button', key: metric.key, className: 'pi-dashboard-metric is-actionable', onClick: () => navigateWorkspaceMetric(metric.target), 'aria-label': `${metric.label}: ${metric.value ?? 0}` },
        h('span', { className: 'pi-dashboard-metric-top' }, metric.label, h(Icon, { 'aria-hidden': true })),
        h('strong', null, workspaceLoading && !workspaceSummary ? '—' : Number(metric.value || 0).toLocaleString()))
    })),
    h('div', { className: 'pi-dashboard-main-grid' },
      h('section', { className: 'pi-dashboard-panel', 'aria-label': t('chartTitle') },
        h('div', { className: 'pi-dashboard-panel-heading' }, h('div', null, h('h2', null, t('chartTitle')), h('p', null, t('chartSubtitle')))), dashboardChart),
      h('section', { className: 'pi-dashboard-panel', 'aria-label': t('todoTitle') },
        h('div', { className: 'pi-dashboard-panel-heading' }, h('div', null, h('h2', null, t('todoTitle')), h('p', null, workspaceSummary ? t('todoCount').replace('{count}', String(dashboardTodos.length)) : '')),
          dashboardTodos.length > 5 && h('button', { type: 'button', className: 'pi-button pi-button--small pi-dashboard-todo-more', onClick: () => setWorkspaceTodoDialogOpen(true) }, t('viewAllTodos'))), dashboardTodoContent)),
    h('section', { className: 'pi-dashboard-panel', 'aria-label': t('activityTitle') },
      h('div', { className: 'pi-dashboard-panel-heading' }, h('div', null, h('h2', null, t('activityTitle')))), dashboardActivityContent))

  return { section: dashboardSection, todoDialog: dashboardTodoDialog }
}

module.exports = { renderWorkspaceView }
