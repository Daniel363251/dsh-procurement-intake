const React = require('react')
const { Building2, Package, Tags } = require('lucide-react')
const { AIDataTable } = require('@enterprise/ai-table')
const h = React.createElement

function renderMasterDataView({
  t, masterDataType, masterDataOverviewLoading, masterDataOverviewCount, masterDataLoading,
  masterDataRows, masterDataSelected, masterDataSelection, masterDataDefinition,
  masterDataSelectColumn, masterDataActionColumn, masterDataDraft, masterDataSaving,
  setMasterDataType, setMasterDataRows, setMasterDataDraft, setMasterDataSelected,
  setMasterDataOverviewCount, openMasterDataType, changeMasterDataStatus, deleteMasterRecords,
  refreshMasterData, saveMasterRecord, tableRefreshButton, emptyStateContent,
}) {
  const masterDataSection = h('section', { className: 'pi-card pi-master-data-section' },
    h('div', { className: 'pi-table-toolbar' },
      h('div', null, h('h2', { className: 'pi-section-title' }, t('masterData')), h('p', { className: 'pi-help' }, t('masterDataHelp')))),
    !masterDataType ? masterDataOverviewLoading
      ? h('div', { className: 'pi-empty', role: 'status' }, h('div', { className: 'pi-empty-state-content' }, h('span', { className: 'pi-spinner', 'aria-hidden': true }), h('p', null, t('masterDataLoading'))))
      : masterDataOverviewCount === 0
        ? h('div', { className: 'pi-empty' }, emptyStateContent(t('noMasterData'), t('masterDataHelp')))
        : h('div', { className: 'pi-master-tiles' }, ...[
          ['suppliers', t('suppliers')], ['materials', t('materials')], ['materialCategories', t('materialCategories')],
        ].map(([type, label]) => h('button', { key: type, type: 'button', className: 'pi-master-tile', onClick: () => openMasterDataType(type) },
          h('span', { className: 'pi-master-tile-icon', 'aria-hidden': true }, h(type === 'suppliers' ? Building2 : type === 'materials' ? Package : Tags, { 'aria-hidden': true })),
          h('strong', null, label))))
      : h(React.Fragment, null,
        h('div', { className: 'pi-master-subnav' },
          h('button', { type: 'button', className: 'pi-master-back', onClick: () => { setMasterDataType(null); setMasterDataRows([]); setMasterDataDraft(null); setMasterDataSelected(new Set()); setMasterDataOverviewCount(null) } }, '‹'),
          ...[
          ['suppliers', t('suppliers')], ['materials', t('materials')], ['materialCategories', t('materialCategories')],
        ].map(([type, label]) => h('button', { key: type, type: 'button', className: `pi-master-subnav-item${masterDataType === type ? ' is-active' : ''}`, onClick: () => { if (masterDataType !== type) openMasterDataType(type) } }, label))),
        h('div', { className: 'pi-batch-bar' },
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !masterDataSelected.size || masterDataLoading, onClick: () => void changeMasterDataStatus([...masterDataSelected], 'enabled') }, `${t('enableSelected')}${masterDataSelected.size ? ` (${masterDataSelected.size})` : ''}`),
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !masterDataSelected.size || masterDataLoading, onClick: () => void changeMasterDataStatus([...masterDataSelected], 'disabled') }, `${t('disableSelected')}${masterDataSelected.size ? ` (${masterDataSelected.size})` : ''}`),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--danger', disabled: !masterDataSelected.size || masterDataLoading, onClick: () => void deleteMasterRecords([...masterDataSelected]) }, `${t('delete')}${masterDataSelected.size ? ` (${masterDataSelected.size})` : ''}`),
          tableRefreshButton(() => { setMasterDataSelected(new Set()); void refreshMasterData() }, masterDataLoading)),
        masterDataRows.length > 0 ? h(AIDataTable, {
          definition: masterDataDefinition, rows: masterDataRows, storageScope: 'hilda:dsh-procurement-intake',
          fillWidth: true,
          defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
          key: `master-data-${masterDataType}`,
          columnSettings: { storageKey: `hilda:dsh-procurement-intake:master-data:v3:${masterDataType}` },
          loading: masterDataLoading, getRowId: row => row.id,
          rowSelection: masterDataSelection,
          onRowSelectionChange: selection => setMasterDataSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
          leadingColumns: [masterDataSelectColumn], additionalColumns: [masterDataActionColumn], emptyText: emptyStateContent(t('noMasterData'), t('masterDataHelp'), { compact: true }),
        }) : masterDataLoading
          ? h('div', { className: 'pi-empty', role: 'status' }, h('div', { className: 'pi-empty-state-content' }, h('span', { className: 'pi-spinner', 'aria-hidden': true }), h('p', null, t('masterDataLoading'))))
          : h('div', { className: 'pi-empty' }, emptyStateContent(t('noMasterData'), t('masterDataHelp')))))
  const masterDataEditDrawer = masterDataDraft && h('div', {
    className: 'pi-drawer-overlay',
    onClick: event => { if (event.target === event.currentTarget && !masterDataSaving) setMasterDataDraft(null) },
  }, h('form', { className: 'pi-drawer-panel pi-detail-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('editMasterRecord'), onSubmit: event => { event.preventDefault(); void saveMasterRecord() } },
    h('div', { className: 'pi-detail-heading' },
      h('div', null, h('h3', { className: 'pi-dialog-title' }, t('editMasterRecord')), h('p', { className: 'pi-dialog-description' }, masterDataDraft.name || masterDataDraft.code || '')),
      h('div', { className: 'pi-order-detail-heading-actions' },
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: masterDataSaving, onClick: () => setMasterDataDraft(null) }, t('cancelEdit')),
        h('button', { type: 'submit', className: 'pi-button pi-button--small pi-button--primary', disabled: masterDataSaving || !masterDataDraft.name?.trim() }, masterDataSaving ? t('saving') : t('saveSettings')))),
    h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('masterDataFields')),
      h('div', { className: 'pi-detail-form' },
        masterDataType === 'materials' && h('label', { className: 'pi-detail-field' }, h('span', null, t('masterCode')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.code || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, code: event.target.value })) })),
        h('label', { className: 'pi-detail-field' }, h('span', null, t('masterName')), h('input', { className: 'pi-input pi-detail-input', autoFocus: true, value: masterDataDraft.name || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, name: event.target.value })) })),
        masterDataType === 'materials' && h(React.Fragment, null,
          h('label', { className: 'pi-detail-field' }, h('span', null, t('materialCategory')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.category || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, category: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('masterSpecification')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.specification || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, specification: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('masterUnit')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.unit || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, unit: event.target.value })) })))))))
  return { section: masterDataSection, editDrawer: masterDataEditDrawer }
}

module.exports = { renderMasterDataView }
