function getRouteTitle(menu, t) {
  const titles = {
    workspace: 'workspace', requests: 'requests', orders: 'ordersMenu',
    issues: 'issues', settings: 'modelSettings', masterData: 'masterData',
  }
  return t(titles[menu] || 'comingSoon')
}

function getRouteContent({ menu, requestView, views }) {
  if (menu === 'requests') {
    return requestView === 'intake'
      ? [views.uploadSection, views.previewSection, views.searchSection, views.batchSection, views.candidateSection]
      : [views.mineSection]
  }
  if (menu === 'orders') return [views.orderSection]
  if (menu === 'settings') return [views.settingsSection]
  if (menu === 'masterData') return [views.masterDataSection]
  if (menu === 'workspace') return [views.dashboardSection]
  return [views.placeholder]
}

module.exports = { getRouteTitle, getRouteContent }
