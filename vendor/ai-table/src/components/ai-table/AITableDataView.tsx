import * as React from 'react'
import { useTranslation } from '../../i18n'
import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'
import { Sparkles } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { WmsDataTable, type WmsDataTableProps } from '../wms/DataTable'
import type { WmsColumnSettingsState } from '../../hooks/useColumnSettings'
import { AITableDraftBar } from './AITableDraftBar'
import { AITableProvider, useAITable } from './AITableProvider'
import { AITableToolbar } from './AITableToolbar'
import { normalizeFrozenColumnCount } from './ai-table-engine'
import { getColorStyle, getRowMarkerStyle } from './color-palette'
import { SmartTableSwitchingLoader } from './SmartTableSwitchingLoader'
import type { AITableConfig, AITableField, AITableGroup } from './types'

export interface AITableContentProps<TRow> {
  columns: ColumnDef<TRow>[]
  tableProps: Omit<WmsDataTableProps<TRow>, 'data' | 'columns' | 'total'>
  showScopeNote?: boolean
  clientPagination?: boolean
}

function SmartMode<TRow>({ columns, tableProps, showScopeNote = true, clientPagination = false }: AITableContentProps<TRow>) {
  const { t } = useTranslation()
  const [columnSettingsState, setColumnSettingsState] = React.useState<WmsColumnSettingsState>()
  const {
    config,
    state,
    rows,
    appliedFields,
    filteredRows,
    sortedRows,
    serverQuery,
    visibleRows,
    totalCount,
    groups,
    rowColors,
    rowMarkerColors,
    cellColors,
    columnColors,
    updateDraft,
    updateSorts,
  } = useAITable<TRow>()
  const { savedView, draftView } = state
  const viewSignature = JSON.stringify([savedView.filters, savedView.sorts, savedView.groups, rows.length])
  const previousViewSignature = React.useRef(viewSignature)
  React.useEffect(() => {
    if (previousViewSignature.current === viewSignature) return
    previousViewSignature.current = viewSignature
    if (!serverQuery && tableProps.page !== 1) tableProps.onPageChange(1)
  }, [serverQuery, tableProps.onPageChange, tableProps.page, viewSignature])

  const pageCount = Math.max(1, Math.ceil((clientPagination ? filteredRows.length : totalCount) / tableProps.pageSize))
  const currentPage = clientPagination
    ? Math.min(Math.max(1, tableProps.page), pageCount)
    : tableProps.page
  const pageRows = React.useMemo(() => clientPagination
    ? sortedRows.slice((currentPage - 1) * tableProps.pageSize, currentPage * tableProps.pageSize)
    : visibleRows,
  [clientPagination, currentPage, sortedRows, tableProps.pageSize, visibleRows])
  const pageGroups = React.useMemo(() => clientPagination && groups.length
    ? paginateGroups(groups, new Set(pageRows.map(config.rowKey)), config.rowKey)
    : groups,
  [clientPagination, config.rowKey, groups, pageRows])

  const dynamicColumns = React.useMemo<ColumnDef<TRow>[]>(() => {
    const existingIds = new Set(columns.map(getColumnId))
    return appliedFields
      .filter((field) => field.source !== 'business' && !existingIds.has(field.fieldId))
      .sort((left, right) => Number(right.source === 'ai') - Number(left.source === 'ai'))
      .map((field) => createDynamicColumn(field, config.rowKey))
  }, [appliedFields, columns, config.rowKey])

  const allColumns = React.useMemo(() => {
    const regular: ColumnDef<TRow>[] = []
    const trailing: ColumnDef<TRow>[] = []
    for (const column of columns) {
      const id = getColumnId(column)
      const stickyRight = (column.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
      if (id === 'actions' || stickyRight) trailing.push(column)
      else regular.push(column)
    }
    const anchorIndex = regular.findIndex((column) => getColumnId(column) === config.dynamicColumnAnchorFieldId)
    if (anchorIndex < 0) return [...regular, ...dynamicColumns, ...trailing]
    return [
      ...regular.slice(0, anchorIndex + 1),
      ...dynamicColumns,
      ...regular.slice(anchorIndex + 1),
      ...trailing,
    ]
  }, [columns, config.dynamicColumnAnchorFieldId, dynamicColumns])

  const businessColumnIds = React.useMemo(
    () => allColumns.map(getColumnId).filter((id) => id && id !== '__select__' && id !== 'actions'),
    [allColumns],
  )
  const orderedVisibleBusinessColumnIds = React.useMemo(() => {
    const businessIds = new Set(businessColumnIds)
    const visibleIds = new Set(columnSettingsState?.visible ?? businessColumnIds)
    const order = columnSettingsState?.order ?? businessColumnIds
    return [
      ...order.filter((id) => businessIds.has(id)),
      ...businessColumnIds.filter((id) => !order.includes(id)),
    ].filter((id) => visibleIds.has(id))
  }, [businessColumnIds, columnSettingsState])
  const frozenCount = normalizeFrozenColumnCount(draftView.frozenColumnCount, orderedVisibleBusinessColumnIds.length)
  const frozenLeftColumnIds = orderedVisibleBusinessColumnIds.slice(0, frozenCount)
  const onColumnSettingsStateChange = React.useCallback((next: WmsColumnSettingsState) => {
    setColumnSettingsState(next)
  }, [])
  const markerColumnId = allColumns.some((column) => getColumnId(column) === '__select__')
    ? '__select__'
    : businessColumnIds[0]

  const onGroupToggle = React.useCallback((groupKey: string) => {
    const collapsed = draftView.collapsedGroupKeys
    updateDraft({
      collapsedGroupKeys: collapsed.includes(groupKey)
        ? collapsed.filter((key) => key !== groupKey)
        : [...collapsed, groupKey],
    })
  }, [draftView.collapsedGroupKeys, updateDraft])

  const onServerSortingChange = React.useCallback<OnChangeFn<SortingState>>((updater) => {
    const current = savedView.sorts.map((sort) => ({ id: sort.fieldId, desc: sort.direction === 'desc' }))
    const sorting = typeof updater === 'function' ? updater(current) : updater
    updateSorts(sorting.map(({ id, desc }) => ({ fieldId: id, direction: desc ? 'desc' : 'asc' })))
  }, [savedView.sorts, updateSorts])

  return (
    <WmsDataTable
      {...tableProps}
      columns={allColumns}
      data={pageRows}
      page={currentPage}
      total={clientPagination ? filteredRows.length : totalCount}
      serverSorting={serverQuery ? savedView.sorts.map((sort) => ({ id: sort.fieldId, desc: sort.direction === 'desc' })) : undefined}
      onServerSortingChange={serverQuery ? onServerSortingChange : undefined}
      emptyText={savedView.filters.length ? t('aiTable.dataView.noFilteredRecords') : tableProps.emptyText}
      rowStyle={(row) => getColorStyle(rowColors.get(config.rowKey(row)))}
      cellStyle={(row, columnId) => {
        const rowKey = config.rowKey(row)
        const cellColor = cellColors.get(rowKey)?.get(columnId) ?? columnColors.get(columnId)
        return {
          ...getColorStyle(cellColor),
          ...(columnId === markerColumnId ? getRowMarkerStyle(rowMarkerColors.get(rowKey)) : undefined),
        }
      }}
      columnStyle={(columnId) => getColorStyle(columnColors.get(columnId))}
      groups={pageGroups.length ? pageGroups : undefined}
      onGroupToggle={onGroupToggle}
      frozenLeftColumnIds={frozenLeftColumnIds}
      onFrozenColumnCountChange={(count) => updateDraft({ frozenColumnCount: Math.max(1, count) })}
      minFrozenColumnCount={1}
      columnSettings={tableProps.columnSettings}
      onColumnSettingsStateChange={tableProps.columnSettings ? onColumnSettingsStateChange : undefined}
      viewToolbar={({ openColumnSettings, selectedCount }) => (
        <AITableToolbar openColumnSettings={openColumnSettings} selectedCount={selectedCount} />
      )}
      viewStatus={<AITableDraftBar />}
      showColumnControls={false}
      scopeNote={showScopeNote ? (
        <span>
          {t('aiTable.dataView.scopeNote', { filtered: filteredRows.length, total: totalCount })}
        </span>
      ) : undefined}
    />
  )
}

export function AITableContent<TRow>({ columns, tableProps, showScopeNote = true, clientPagination = false }: AITableContentProps<TRow>) {
  const { config, state, rows, totalCount } = useAITable<TRow>()
  if (state.modeTransition === 'switching-to-smart') {
    return (
      <SmartTableSwitchingLoader
        {...config.switchingLoaderCopy}
        className="smart-table-loader-embedded"
      />
    )
  }
  if (state.mode === 'classic') {
    const pageCount = Math.max(1, Math.ceil(totalCount / tableProps.pageSize))
    const currentPage = clientPagination ? Math.min(Math.max(1, tableProps.page), pageCount) : tableProps.page
    const pageRows = clientPagination
      ? rows.slice((currentPage - 1) * tableProps.pageSize, currentPage * tableProps.pageSize)
      : rows
    return <WmsDataTable {...tableProps} columns={columns} data={pageRows} page={currentPage} total={totalCount} />
  }
  return <SmartMode columns={columns} tableProps={tableProps} showScopeNote={showScopeNote} clientPagination={clientPagination} />
}

export interface AITableDataViewProps<TRow> {
  config: AITableConfig<TRow>
  rows: TRow[]
  totalCount: number
  columns: ColumnDef<TRow>[]
  tableProps: Omit<WmsDataTableProps<TRow>, 'data' | 'columns' | 'total'>
}

/** @deprecated 新页面使用 AITableProvider + AITableContent。 */
export function AITableDataView<TRow>({ config, rows, totalCount, columns, tableProps }: AITableDataViewProps<TRow>) {
  return (
    <AITableProvider config={config} rows={rows} totalCount={totalCount}>
      <AITableContent columns={columns} tableProps={tableProps} />
    </AITableProvider>
  )
}

function getColumnId<TRow>(column: ColumnDef<TRow>): string {
  return String(column.id ?? ('accessorKey' in column ? column.accessorKey : ''))
}

function paginateGroups<TRow>(
  groups: AITableGroup<TRow>[],
  pageRowKeys: Set<string>,
  rowKey: (row: TRow) => string,
): AITableGroup<TRow>[] {
  return groups.flatMap((group) => {
    const rows = group.rows.filter((row) => pageRowKeys.has(rowKey(row)))
    const children = group.children ? paginateGroups(group.children, pageRowKeys, rowKey) : undefined
    const count = children?.length
      ? children.reduce((sum, child) => sum + child.count, 0)
      : rows.length
    if (count === 0) return []
    return [{ ...group, rows, children, count }]
  })
}

function createDynamicColumn<TRow>(
  field: AITableField<TRow>,
  rowKey: (row: TRow) => string,
): ColumnDef<TRow> {
  return {
    id: field.fieldId,
    header: () => (
      <span className="flex items-center gap-1.5 whitespace-nowrap">
        {field.source === 'ai' ? <Sparkles className="size-3.5 text-primary" /> : null}
        {field.label.replace('（Demo派生）', '')}
      </span>
    ),
    size: field.type === 'number' ? 120 : 150,
    cell: ({ row }) => {
      const value = field.getValue(row.original)
      if (value == null || value === '') return <span className="text-muted-foreground">—</span>
      if (field.fieldId.toLowerCase().includes('progress') && typeof value === 'number') {
        return (
          <div className="flex min-w-24 items-center gap-2">
            <span className="w-8 text-right text-xs tabular-nums">{value}%</span>
            <Progress value={value} className="h-1.5 flex-1" />
          </div>
        )
      }
      if (field.source === 'ai' || field.type === 'tag') return <SmartBadge value={String(value)} />
      const display = field.formatValue?.(value, row.original) ?? String(value)
      return <span className="text-sm" title={`${rowKey(row.original)} · ${display}`}>{display}</span>
    },
  }
}

function SmartBadge({ value }: { value: string }) {
  const { t } = useTranslation()
  const normalized = value.toUpperCase()
  const variant = normalized.includes('HIGH') || value.includes(t('aiTable.badge.highRisk'))
    ? 'rejected'
    : normalized.includes('MEDIUM') || normalized.includes('ATTENTION') || value.includes(t('aiTable.badge.attention')) || value.includes(t('aiTable.badge.mediumRisk'))
      ? 'pending'
      : 'approved'
  const label = normalized === 'HIGH' ? t('aiTable.badge.highRisk')
    : normalized === 'MEDIUM' ? t('aiTable.badge.mediumRisk')
      : normalized === 'LOW' ? t('aiTable.badge.lowRisk')
        : normalized === 'ATTENTION' ? t('aiTable.badge.attention')
          : normalized === 'NORMAL' ? t('aiTable.badge.normal')
            : value
  return <Badge variant={variant}>{label}</Badge>
}
