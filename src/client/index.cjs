const React = require('react')
const { TYPERT_REMOTE } = require('../../typert.remote-client.js')
const { zh, en } = require('./locales.cjs')
const { dataAccess } = require('./lib/procurement-data-access.cjs')
const { IntakeErrorBoundary, IntakeBody, PluginGuideIcon } = require('./app/App.cjs')
const h = React.createElement
const namespace = 'procurementIntake'

module.exports = {
  inject: ['slots', 'sidebarRightTabs', 'locale', 'remote'],
  async apply(ctx) {
    const t = ctx.locale.bind(namespace)
    ctx.effect(() => ctx.locale.register(namespace, { zh, en }), 'procurement-intake: dictionaries')
    const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)
    ctx.effect(() => disposeRemote, 'procurement-intake: remote')
    ctx.effect(() => ctx.sidebarRightTabs.register({ id: '@hilda-biz/dsh-procurement-intake', kind: 'procurement-intake', priority: 'extension', title: () => t('title'), guide: [{ id: 'intake', order: 30, title: () => t('title'), description: () => t('subtitle'), icon: PluginGuideIcon }] }), 'procurement-intake: tab type')
    const data = dataAccess(ctx)
    ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({ name: 'sidebar.right.pane.tab', key: '@hilda-biz/dsh-procurement-intake', locale: namespace }, (props) => h(IntakeErrorBoundary, null, h(IntakeBody, { ...props, data })))), 'procurement-intake: tab body')
  },
}
