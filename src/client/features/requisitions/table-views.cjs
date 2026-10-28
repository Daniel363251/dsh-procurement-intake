const React = require('react')
const { AIDataTable, defineAITable } = require('@enterprise/ai-table')
const { CALENDAR_ICON, TRASH_ICON, orderStatusBadge } = require('../../components/presentation.cjs')
const h = React.createElement
const { renderRowActionMenu } = require('../../components/row-action-menu.cjs')

function useRequisitionTableViews({
  t, aiAdapter, pending, query, words, store, selected, setSelected, toggle, candidates,
  pendingLoading, pendingPage, pendingPageSize, refreshTable, tableRefreshButton, changePage,
  changePageSize, updateTableQuery, PENDING_QUERY_FIELD_IDS, emptyStateContent, openDetails, deleteOwned,
  mine, mineSelected, setMineSelected, toggleMine, MINE_COLUMN_SETTINGS_KEY, MINE_QUERY_FIELD_IDS,
  setBatchNotesDraft, setBatchNotesDialogOpen, setBatchSupplierDraft, setSupplierDialogOpen, setShipDialogOpen, deleteSelected, mineLoading, minePage,
  minePageSize, copyCell, qty, formatDateTime,
}) {
  const pendingDefinition = React.useMemo(() => defineAITable({
    id: 'procurement.pending-lines', rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter },
    fields: [
      { id: 'materialName', label: t('material'), type: 'text', accessor: 'materialName', render: value => copyCell(value, t('material')), width: 210 },
      { id: 'materialCode', label: t('materialCode'), type: 'text', accessor: 'materialCode', render: value => copyCell(value, t('materialCode')), width: 140 },
      { id: 'materialCategory', label: t('materialCategory'), type: 'text', accessor: 'materialCategory', width: 120 },
      { id: 'specification', label: t('spec'), type: 'text', read: row => [row.specification, row.model].filter(Boolean).join(' · '), width: 150 },
      { id: 'requisitionNo', label: t('requisitionNo'), type: 'text', accessor: 'requisitionNo', render: value => copyCell(value, t('requisitionNo')), width: 210 },
      { id: 'procurementOrg', label: t('procurementOrg'), type: 'text', read: row => row.procurementOrg || row.sourceFields?.['采购组织'] || row.sourceFields?.['未命名列14'] || row.sourceFields?.['Unnamed column 14'] || '', render: value => copyCell(value, t('procurementOrg')), width: 190 },
      { id: 'lineNo', label: t('lineNo'), type: 'text', accessor: 'lineNo', width: 90 },
      { id: 'quantity', label: t('quantity'), type: 'number', read: row => Number(row.quantity) || 0, format: (_value, row) => qty(row), width: 100 },
      { id: 'demandDate', label: t('expectedDate'), type: 'date', accessor: 'demandDate', width: 120 },
      { id: 'sameRequisitionContext', label: t('context'), type: 'text', read: row => words.length ? store.pendingContextRows.filter(item => item.requisitionNo === row.requisitionNo && item.id !== row.id) : [], render: value => value.length ? h('details', null, h('summary', null, `${t('context')} · ${value.length}（${t('contextOnly')}）`), h('div', { className: 'pi-list' }, ...value.map(row => h('div', { key: row.id, className: 'pi-line pi-line--context' }, h('p', { className: 'pi-material' }, row.materialName || t('material')), h('p', { className: 'pi-help' }, [row.materialCode, row.specification, row.model].filter(Boolean).join(' · ')))))) : '—', filterable: false, groupable: false, sortable: false, colorable: false, aiReadable: false, width: 220 },
      { id: 'review', label: t('review'), type: 'tag', read: row => row.needsReview ? t('review') : '', groupable: true, width: 95 },
    ],
  }), [t, pending, query, store.pendingContextRows])
  const pendingSelection = Object.fromEntries([...selected].map(id => [id, true]))
  const pendingSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => selected.has(row.id)), onChange: event => setSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.id) : next.delete(row.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => h('input', { className: 'pi-check', type: 'checkbox', checked: selected.has(row.original.id), onChange: event => toggle(row.original.id, event.target.checked), 'aria-label': `选择 ${row.original.materialName || row.original.requisitionNo}` }),
  }
  const candidateSection = store.pendingTotal > 0 ? h('section', { className: 'pi-card', 'aria-label': t('candidates') },
    h('div', { className: 'pi-batch-bar' }, tableRefreshButton(() => refreshTable('pending'), pendingLoading)),
    h(AIDataTable, {
      definition: pendingDefinition, rows: candidates, storageScope: 'hilda:dsh-procurement-intake',
      defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
      columnSettings: { storageKey: 'hilda:dsh-procurement-intake:procurement.pending-lines:columns:v2' },
      loading: pendingLoading,
      page: pendingPage, pageSize: pendingPageSize, onPageChange: page => changePage('pending', page),
      onPageSizeChange: pageSize => changePageSize('pending', pageSize), total: store.pendingFilteredTotal,
      onQueryChange: queryState => updateTableQuery('pending', queryState),
      queryFieldIds: PENDING_QUERY_FIELD_IDS,
      getRowId: row => row.id, rowSelection: pendingSelection,
      onRowSelectionChange: selection => setSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
      leadingColumns: [pendingSelectColumn], emptyText: emptyStateContent(t('notFound'), t('tryShorter'), { compact: true }),
    })) : h('div', { className: 'pi-card pi-empty' }, emptyStateContent('暂无待筛选明细', '先导入 NC 请购单。'))

  const mineDefinition = React.useMemo(() => defineAITable({
    id: 'procurement.owned-lines', rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter },
    fields: [
      { id: 'materialName', label: t('materialInfo'), type: 'text', accessor: 'materialName', render: value => copyCell(value, t('material')), width: 210 },
      { id: 'materialCode', label: t('materialCode'), type: 'text', accessor: 'materialCode', render: value => copyCell(value, t('materialCode')), width: 140 },
      { id: 'materialCategory', label: t('materialCategory'), type: 'text', accessor: 'materialCategory', width: 120 },
      { id: 'specification', label: t('spec'), type: 'text', read: row => [row.specification, row.model].filter(Boolean).join(' · '), width: 150 },
      { id: 'requisitionNo', label: t('requisitionNo'), type: 'text', accessor: 'requisitionNo', render: value => copyCell(value, t('requisitionNo')), width: 210 },
      { id: 'procurementOrg', label: t('procurementOrg'), type: 'text', read: row => row.procurementOrg || row.sourceFields?.['采购组织'] || row.sourceFields?.['未命名列14'] || row.sourceFields?.['Unnamed column 14'] || '', render: value => copyCell(value, t('procurementOrg')), width: 190 },
      { id: 'lineNo', label: t('lineNo'), type: 'text', accessor: 'lineNo', width: 90 },
      { id: 'quantity', label: t('quantity'), type: 'number', read: row => Number(row.quantity) || 0, format: (_value, row) => qty(row), width: 90 },
      { id: 'remainingQuantity', label: t('remainingQuantity'), type: 'number', read: row => Number(row.remainingQuantity) || 0, format: (_value, row) => row.remainingQuantity ? `${row.remainingQuantity}${row.unit ? ' ' + row.unit : ''}` : '—', width: 120 },
      { id: 'purchaseOrderNo', label: t('purchaseOrder'), type: 'text', accessor: 'purchaseOrderNo', render: value => copyCell(value, t('purchaseOrder')), width: 180 },
      { id: 'supplier', label: t('supplier'), type: 'text', accessor: 'supplier', render: value => copyCell(value, t('supplier')), width: 180 },
      { id: 'anomalyFocus', label: t('anomalyFocus'), type: 'text', read: row => (row.anomalyFocus || []).map(key => t(key)).join('、'), render: (_value, row) => (row.anomalyFocus || []).length ? h('div', { className: 'pi-anomaly-tags' }, ...row.anomalyFocus.map(key => h('span', { key, className: 'pi-badge pi-badge--warn' }, t(key)))) : '—', width: 220 },
      { id: 'orderStatus', label: t('orderStatus'), type: 'tag', read: row => row.orderStatus || (row.isMine ? t('unmatchedPurchaseOrder') : ''), render: (_value, row) => orderStatusBadge({ ...row, orderStatus: row.orderStatus || (row.isMine ? t('unmatchedPurchaseOrder') : '') }), width: 145 },
      { id: 'demandDate', label: t('expectedDate'), type: 'date', accessor: 'demandDate', width: 120 },
      { id: 'expectedShipAt', label: t('expectedShip'), type: 'date', read: row => row.expectedShipAt || row.buyerEtaFromFile || '', width: 130 },
      { id: 'notes', label: t('notes'), type: 'text', accessor: 'notes', width: 180 },
      { id: 'confirmedAt', label: t('claimedAt'), type: 'datetime', read: row => formatDateTime(row.confirmedAt), width: 145 },
    ],
  }), [t])
  const mineSelection = Object.fromEntries([...mineSelected].map(id => [id, true]))
  const mineSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => mineSelected.has(row.id)), onChange: event => setMineSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.id) : next.delete(row.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => h('input', { className: 'pi-check', type: 'checkbox', checked: mineSelected.has(row.original.id), onChange: event => toggleMine(row.original.id, event.target.checked), 'aria-label': `选择 ${row.original.materialName || row.original.requisitionNo}` }),
  }
  const mineActionColumn = {
    id: 'actions', size: 64, enableSorting: false, enableHiding: false, meta: { sticky: 'right' },
    header: () => t('orderActions'), cell: ({ row }) => renderRowActionMenu(t('orderActions'), [
      { label: t('viewDetails'), onSelect: () => openDetails(row.original) },
      { label: t('delete'), danger: true, onSelect: () => deleteOwned(row.original.id) },
    ]),
  }
  const mineSection = h('section', { className: 'pi-card' },
    h('div', { className: 'pi-table-toolbar' },
      h('h2', { className: 'pi-section-title' }, t('myRequests')),
      h('span', { className: 'pi-table-total' }, t('tableTotal').replace('{count}', String(store.mineFilteredTotal)))),
    store.mineTotal > 0 ? h(React.Fragment, null,
      h('div', { className: 'pi-batch-bar' },
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', style: { width: 'auto' }, disabled: !mineSelected.size, onClick: () => setShipDialogOpen(true) }, CALENDAR_ICON, `批量更新发货日期${mineSelected.size ? ` (${mineSelected.size})` : ''}`),
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !mineSelected.size, onClick: () => { setBatchSupplierDraft(''); setSupplierDialogOpen(true) } }, t('batchSupplier')),
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !mineSelected.size, onClick: () => { setBatchNotesDraft(''); setBatchNotesDialogOpen(true) } }, t('batchNotes')),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--danger', disabled: !mineSelected.size, onClick: deleteSelected }, TRASH_ICON, `删除所选${mineSelected.size ? ` ${mineSelected.size} 条` : ''}`),
        tableRefreshButton(() => refreshTable('mine'), mineLoading)),
      h(AIDataTable, {
        definition: mineDefinition, rows: mine, storageScope: 'hilda:dsh-procurement-intake',
        defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
        columnSettings: { storageKey: MINE_COLUMN_SETTINGS_KEY },
        loading: mineLoading,
        page: minePage, pageSize: minePageSize, onPageChange: page => changePage('mine', page),
        onPageSizeChange: pageSize => changePageSize('mine', pageSize), total: store.mineFilteredTotal,
        onQueryChange: queryState => updateTableQuery('mine', queryState),
        queryFieldIds: MINE_QUERY_FIELD_IDS,
        getRowId: row => row.id, rowSelection: mineSelection,
        onRowSelectionChange: selection => setMineSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
        leadingColumns: [mineSelectColumn], additionalColumns: [mineActionColumn], emptyText: emptyStateContent(t('noMine'), '在“待筛选”中输入物料关键词，核对命中明细后再确认归属。', { compact: true }),
      }))
      : h('div', { className: 'pi-empty' }, emptyStateContent(t('noMine'), '在“待筛选”中输入物料关键词，核对命中明细后再确认归属。')))

  return { pendingDefinition, pendingSelection, pendingSelectColumn, candidateSection, mineDefinition, mineSelection, mineSelectColumn, mineActionColumn, mineSection }
}

module.exports = { useRequisitionTableViews }
