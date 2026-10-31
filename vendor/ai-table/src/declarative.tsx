import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AIWmsDataTable, type AIWmsDataTableAIProps } from './components/ai-table/AIWmsDataTable'
import { AITableProvider } from './components/ai-table/AITableProvider'
import { AITableContent } from './components/ai-table/AITableDataView'
import { AITableModeSwitch } from './components/ai-table/AITableModeSwitch'
import type { WmsDataTableProps } from './components/wms/DataTable'
import type { AITableAIAdapter, AITableField, AITableFieldType, AITableFilterRule, AITableMode, AITableSortRule, AITableSwitchingLoaderCopy } from './components/ai-table/types'
import { cn } from './lib/utils'

export interface AITableFieldDeclaration<TRow> {
  id: string
  label: string
  type: AITableFieldType
  accessor?: keyof TRow & string
  read?: (row: TRow) => unknown
  source?: 'business' | 'derived'
  options?: AITableField<TRow>['options']
  format?: (value: unknown, row: TRow) => string
  render?: (value: unknown, row: TRow) => React.ReactNode
  width?: number
  filterable?: boolean
  groupable?: boolean
  sortable?: boolean
  colorable?: boolean
  aiReadable?: boolean
}

export interface AITableDefinition<TRow> {
  id: string
  /** A business key, never the current page's array index. */
  rowKey: (row: TRow) => string
  fields: AITableFieldDeclaration<TRow>[]
  ai: { mode: 'adapter'; adapter: AITableAIAdapter<TRow> }
  dynamicColumnAnchorFieldId?: string
  switchingLoaderCopy?: AITableSwitchingLoaderCopy
}

export function defineAITable<TRow>(definition: AITableDefinition<TRow>): AITableDefinition<TRow> {
  if (!definition.id.trim()) throw new Error('A table id is required')
  const ids = definition.fields.map((field) => field.id)
  if (!ids.length || new Set(ids).size !== ids.length) throw new Error('Field ids must be nonempty and unique')
  for (const field of definition.fields) {
    if (!field.id || ['actions', '__select__', '__index__'].includes(field.id)) throw new Error(`Reserved or empty field id: ${field.id}`)
    if (!field.read && !field.accessor) throw new Error(`Declare accessor or read for ${field.id}`)
  }
  return definition
}

export function compileAITable<TRow>(definition: AITableDefinition<TRow>) {
  const fields: AITableField<TRow>[] = definition.fields.map((field) => ({
    fieldId: field.id, label: field.label, type: field.type, source: field.source ?? 'business',
    getValue: field.read ?? ((row) => row[field.accessor!]),
    formatValue: field.format, options: field.options,
    filterable: field.filterable ?? true, groupable: field.groupable ?? true,
    sortable: field.sortable ?? true, colorable: field.colorable ?? true, aiReadable: field.aiReadable ?? true,
  }))
  const columns: ColumnDef<TRow>[] = definition.fields.map((field) => {
    const registered = fields.find((candidate) => candidate.fieldId === field.id)!
    return {
      id: field.id, accessorFn: registered.getValue, header: field.label, size: field.width ?? 160,
      enableSorting: field.sortable ?? true,
      cell: ({ row }) => {
        const value = registered.getValue(row.original)
        return field.render ? field.render(value, row.original)
          : field.format ? field.format(value, row.original)
            : value == null || value === '' ? '—' : String(value)
      },
    }
  })
  return { fields, columns }
}

export type AIDataTableProps<TRow> = Omit<WmsDataTableProps<TRow>, 'columns' | 'data' | 'getRowId' | 'page' | 'pageSize' | 'onPageChange'> & {
  definition: AITableDefinition<TRow>
  rows: TRow[]
  /** When page and onPageChange are supplied, pagination is controlled by the host. */
  page?: number
  /** Defaults to 10 for component-managed pagination. */
  pageSize?: number
  /** Omit page and onPageChange to use component-managed client pagination. */
  onPageChange?: (page: number) => void
  /** When provided, saved filters and sorts are delegated to the host query. */
  onQueryChange?: (query: { filters: AITableFilterRule[]; sorts: AITableSortRule[] }) => void
  /** Restrict server filter/sort controls to fields understood by the host. */
  queryFieldIds?: string[]
  /** Include application + tenant + user, and change on account/tenant switching. */
  storageScope: string
  defaultMode?: AITableMode
  /** Force the selected mode regardless of a previously saved user preference. */
  modeLock?: AITableMode
  enabled?: boolean
  showModeSwitch?: boolean
  /** Hide the smart-view demo scope note for application-managed data. */
  showScopeNote?: boolean
  className?: string
  /** Optional action/selection columns rendered before declared business fields. */
  leadingColumns?: ColumnDef<TRow>[]
  /** Optional action/selection columns rendered after declared business fields. */
  additionalColumns?: ColumnDef<TRow>[]
}

export function AIDataTable<TRow>({
  definition, rows, storageScope, defaultMode = 'classic', modeLock, enabled = true, showModeSwitch = true,
  showScopeNote = true, className, leadingColumns, additionalColumns, page, pageSize, onPageChange,
  onPageSizeChange, onQueryChange, queryFieldIds, ...tableProps
}: AIDataTableProps<TRow>) {
  const controlledPagination = page !== undefined && onPageChange !== undefined
  const [clientPage, setClientPage] = React.useState(page ?? 1)
  const [clientPageSize, setClientPageSize] = React.useState(pageSize ?? 10)
  const resolvedPage = controlledPagination ? page : clientPage
  const resolvedPageSize = controlledPagination ? (pageSize ?? 10) : clientPageSize
  const handlePageChange = controlledPagination ? onPageChange : setClientPage
  const handlePageSizeChange = controlledPagination
    ? onPageSizeChange
    : (size: number) => { setClientPageSize(size); setClientPage(1) }

  const compiled = React.useMemo(() => compileAITable(definition), [definition])
  const columns = React.useMemo(
    () => [...(leadingColumns ?? []), ...compiled.columns, ...(additionalColumns ?? [])],
    [additionalColumns, compiled, leadingColumns],
  )
  const adapter = React.useMemo(() => definition.ai.adapter, [definition.ai])
  if (!storageScope.trim()) throw new Error('storageScope is required')
  const keys = rows.map(definition.rowKey)
  if (keys.some((key) => !key) || new Set(keys).size !== keys.length) throw new Error('Rows must have unique, nonempty business keys')
  const tableId = JSON.stringify([storageScope, definition.id])
  const config = {
    tableId, rowKey: definition.rowKey, fields: compiled.fields, aiAdapter: adapter,
    demoScope: 'CURRENT_PAGE' as const,
    dynamicColumnAnchorFieldId: definition.dynamicColumnAnchorFieldId,
    switchingLoaderCopy: definition.switchingLoaderCopy,
  }
  const disabledRows = controlledPagination
    ? rows
    : rows.slice((resolvedPage - 1) * resolvedPageSize, resolvedPage * resolvedPageSize)
  const resolvedTableProps = {
    ...tableProps,
    page: resolvedPage,
    pageSize: resolvedPageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    total: controlledPagination ? tableProps.total : rows.length,
  }
  return (
    <div className={cn('ai-table-plugin', className)} data-ai-table-id={definition.id}>
      {enabled ? (
        <AITableProvider key={tableId} config={config} rows={rows} totalCount={tableProps.total} defaultMode={defaultMode} modeLock={modeLock} onQueryChange={onQueryChange} queryFieldIds={queryFieldIds}>
          {showModeSwitch ? <div className="mb-3 flex justify-end"><AITableModeSwitch /></div> : null}
          <AITableContent
            columns={columns}
            tableProps={{ ...resolvedTableProps, getRowId: definition.rowKey }}
            showScopeNote={showScopeNote}
            clientPagination={!controlledPagination}
          />
        </AITableProvider>
      ) : (
        <AIWmsDataTable {...resolvedTableProps} enabled={false} columns={columns} data={disabledRows} getRowId={definition.rowKey}
          aiTable={{ tableId, aiAdapter: adapter } satisfies AIWmsDataTableAIProps<TRow>} />
      )}
    </div>
  )
}
