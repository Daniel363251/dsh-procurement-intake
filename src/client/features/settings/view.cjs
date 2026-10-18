const React = require('react')
const {
  Select: HildaSelect,
  SelectTrigger: HildaSelectTrigger,
  SelectValue: HildaSelectValue,
  SelectContent: HildaSelectContent,
  SelectItem: HildaSelectItem,
} = require('../../../../vendor/hilda-ui/components/Select.tsx')
const h = React.createElement

function renderSettingsView({
  t, modelOptions, modelSettings, setModelSettings, saveModelSettings, selectPortalRef,
}) {
  return h('section', { className: 'pi-card' },
    h('div', { className: 'pi-inline' }, h('h2', { className: 'pi-section-title' }, t('modelSettings'))),
    h('p', { className: 'pi-help' }, '选择 AI 筛选 / 填色 / 字段生成使用的模型与推理强度。'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 } },
      h('span', { style: { minWidth: 90, color: 'var(--pc-color-text-secondary)', fontSize: 12 } }, t('modelLabel')),
      h(HildaSelect, { items: modelOptions.models.map(model => ({ value: model.id, label: model.name || model.id })), value: modelSettings.model, onValueChange: value => setModelSettings(prev => ({ ...prev, model: value })), 'aria-label': t('modelLabel') },
        h(HildaSelectTrigger, { className: 'pi-model-settings-select', style: { width: 240, minWidth: 0 } }, h(HildaSelectValue)),
        h(HildaSelectContent, { portalContainer: selectPortalRef.current },
          ...modelOptions.models.map(model => h(HildaSelectItem, { key: model.id, value: model.id }, model.name || model.id))))),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 } },
      h('span', { style: { minWidth: 90, color: 'var(--pc-color-text-secondary)', fontSize: 12 } }, t('reasoningEffortLabel')),
      h(HildaSelect, { items: modelOptions.reasoningEfforts.map(effort => ({ value: effort.id, label: effort.name || effort.id })), value: modelSettings.reasoningEffort, onValueChange: value => setModelSettings(prev => ({ ...prev, reasoningEffort: value })), 'aria-label': t('reasoningEffortLabel') },
        h(HildaSelectTrigger, { className: 'pi-reasoning-settings-select', style: { width: 150, minWidth: 0 } }, h(HildaSelectValue)),
        h(HildaSelectContent, { portalContainer: selectPortalRef.current },
          ...modelOptions.reasoningEfforts.map(effort => h(HildaSelectItem, { key: effort.id, value: effort.id }, effort.name || effort.id))))),
    h('button', { type: 'button', className: 'pi-button pi-button--primary', style: { marginTop: 14 }, onClick: saveModelSettings }, t('saveSettings')))
}

module.exports = { renderSettingsView }
