const React = require('react')
const { defineAITable } = require('@enterprise/ai-table')
const h = React.createElement

function useMasterDataTableViews({
  t, aiAdapter, masterDataType, masterDataSelected, setMasterDataSelected,
  renderRowActionMenu, setMasterDataDraft, changeMasterDataStatus, deleteMasterRecords, formatDateTime,
}) {
  const masterDataDefinition = React.useMemo(() => {
    const statusField = { id: 'status', label: t('masterStatus'), type: 'tag', read: row => row.status === 'enabled' ? t('enabled') : t('disabled'), render: (_value, row) => h('span', { className: `pi-badge ${row.status === 'enabled' ? 'pi-badge--ok' : 'pi-badge--muted'}` }, row.status === 'enabled' ? t('enabled') : t('disabled')), width: 100 }
    const fields = masterDataType === 'suppliers'
      ? [{ id: 'name', label: t('suppliers'), type: 'text', accessor: 'name', width: 240 }, statusField]
      : masterDataType === 'materials'
        ? [
          { id: 'code', label: t('masterCode'), type: 'text', accessor: 'code', width: 150 },
          { id: 'name', label: t('materials'), type: 'text', accessor: 'name', width: 230 },
          { id: 'category', label: t('materialCategory'), type: 'text', accessor: 'category', width: 160 },
          { id: 'specification', label: t('masterSpecification'), type: 'text', accessor: 'specification', width: 220 },
          { id: 'unit', label: t('masterUnit'), type: 'text', accessor: 'unit', width: 90 }, statusField,
        ]
        : [{ id: 'name', label: t('materialCategories'), type: 'text', accessor: 'name', width: 240 }, statusField]
    fields.push(
      { id: 'createdAt', label: t('createdAt'), type: 'text', read: row => formatDateTime(row.createdAt), width: 170 },
      { id: 'updatedAt', label: t('updatedAt'), type: 'text', read: row => formatDateTime(row.updatedAt), width: 170 },
    )
    return defineAITable({ id: `procurement.master-data.${masterDataType}`, rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter }, fields })
  }, [aiAdapter, masterDataType, t])
  const masterDataSelection = Object.fromEntries([...masterDataSelected].map(id => [id, true]))
  const masterDataSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => masterDataSelected.has(row.original.id)), onChange: event => setMasterDataSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.original.id) : next.delete(row.original.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => {
      return h('input', { className: 'pi-check', type: 'checkbox', checked: masterDataSelected.has(row.original.id), onChange: event => setMasterDataSelected(previous => { const next = new Set(previous); event.target.checked ? next.add(row.original.id) : next.delete(row.original.id); return next }), 'aria-label': `选择 ${row.original.name || row.original.code}` })
    },
  }
  const masterDataActionColumn = {
    id: 'actions', size: 64, enableSorting: false, enableHiding: false, meta: { sticky: 'right' },
    header: () => t('orderActions'),
    cell: ({ row }) => renderRowActionMenu(t('orderActions'), [
      { label: t('editMasterRecord'), onSelect: () => setMasterDataDraft({ ...row.original }) },
      { label: row.original.status === 'enabled' ? t('disabled') : t('enabled'), onSelect: () => void changeMasterDataStatus([row.original.id], row.original.status === 'enabled' ? 'disabled' : 'enabled') },
      { label: t('delete'), danger: true, onSelect: () => void deleteMasterRecords([row.original.id]) },
    ]),
  }
  return { masterDataDefinition, masterDataSelection, masterDataSelectColumn, masterDataActionColumn }
}

module.exports = { useMasterDataTableViews }
