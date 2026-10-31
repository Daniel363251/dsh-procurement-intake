/**
 * AIWmsDataTable — WmsDataTable 的 AI Table 插件化包装
 *
 * 页面接入 AI Table 只需一个 aiTable prop：
 * - 字段注册表从 ColumnDef 自动推导（fieldId/label/getValue/类型推断）
 * - 推导不出的部分（枚举 options/formatValue、自定义 getValue、字段类型）
 *   通过 fieldOverrides 按 fieldId 合并
 * - 无对应列的补充字段（如派生字段、无列业务字段）通过 extraFields 注册
 *
 * 通用组件禁止 import 业务 DTO、API 或常量。
 */
import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { WmsDataTableProps } from '../wms/DataTable'
import { WmsDataTable } from '../wms/DataTable'
import { AITableProvider } from './AITableProvider'
import { AITableContent } from './AITableDataView'
import type {
  AITableAIAdapter,
  AITableConfig,
  AITableField,
  AITableFieldOption,
  AITableFieldType,
  AITableSwitchingLoaderCopy,
} from './types'

/** 按 fieldId 覆写自动推导结果；只写推导不出的部分 */
export interface AIWmsDataTableFieldOverride<TRow> {
  fieldId: string
  label?: string
  type?: AITableFieldType
  getValue?: (row: TRow) => unknown
  formatValue?: (value: unknown, row: TRow) => string
  options?: AITableFieldOption[]
  filterable?: boolean
  groupable?: boolean
  colorable?: boolean
  sortable?: boolean
  aiReadable?: boolean
}

export interface AIWmsDataTableAIProps<TRow> {
  tableId: string
  /** 缺省复用 WmsDataTable 的 getRowId */
  rowKey?: (row: TRow) => string
  /** 枚举字段等需要精确控制的字段覆写 */
  fieldOverrides?: AIWmsDataTableFieldOverride<TRow>[]
  /** 无对应表格列的补充字段（Demo 派生字段、仅用于筛选/分组的业务字段） */
  extraFields?: AITableField<TRow>[]
  /** 动态派生/AI 列插入到该业务列之后 */
  dynamicColumnAnchorFieldId?: string
  /** 切换加载态的业务化文案 */
  switchingLoaderCopy?: AITableSwitchingLoaderCopy
  /** AI 能力适配器（必填，由接入方提供） */
  aiAdapter: AITableAIAdapter<TRow>
}

export type AIWmsDataTableProps<TRow> = WmsDataTableProps<TRow> & {
  aiTable: AIWmsDataTableAIProps<TRow>
  enabled?: boolean
}

/** 不参与字段注册的列 */
const SKIPPED_COLUMN_IDS = new Set(['__select__', 'actions'])

const DATE_PREFIX_PATTERN = /^\d{4}-\d{2}-\d{2}/

function getColumnId<TRow>(column: ColumnDef<TRow>): string {
  return String(column.id ?? ('accessorKey' in column ? column.accessorKey : ''))
}

function inferTypeFromSample(sample: unknown): AITableFieldType {
  // 时间戳数字（大于 1e9 = 10 位秒级或 13 位毫秒级）→ datetime
  if (typeof sample === 'number' && sample > 1000000000) return 'datetime'
  if (typeof sample === 'number') return 'number'
  if (typeof sample === 'string' && DATE_PREFIX_PATTERN.test(sample)) return 'datetime'
  return 'text'
}

function findSampleValue<TRow>(
  rows: TRow[],
  getValue: (row: TRow) => unknown,
): unknown {
  for (const row of rows) {
    const value = getValue(row)
    if (value !== null && value !== undefined && value !== '') return value
  }
  return undefined
}

export function deriveFields<TRow>(
  columns: ColumnDef<TRow>[],
  rows: TRow[],
  fieldOverrides: AIWmsDataTableFieldOverride<TRow>[] | undefined,
  extraFields: AITableField<TRow>[] | undefined,
): AITableField<TRow>[] {
  const overrideMap = new Map((fieldOverrides ?? []).map((o) => [o.fieldId, o]))
  const fields: AITableField<TRow>[] = []

  for (const column of columns) {
    const fieldId = getColumnId(column)
    if (!fieldId || SKIPPED_COLUMN_IDS.has(fieldId)) continue
    const stickyRight = (column.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
    if (stickyRight) continue

    const override = overrideMap.get(fieldId)
    let getValue =
      override?.getValue ?? ((row: TRow) => (row as Record<string, unknown>)[fieldId])

    let type = override?.type
    if (!type) {
      if (override?.options) {
        type = 'tag'
      } else {
        const sample = findSampleValue(rows, getValue)
        type = sample === undefined ? 'text' : inferTypeFromSample(sample)
      }
    }

    // 自动给推导为 datetime 的字段加 getValue 转换（时间戳 → ISO 字符串）
    if (type === 'datetime' && !override?.getValue) {
      const originalGetValue = getValue
      getValue = (row: TRow) => {
        const v = originalGetValue(row)
        if (v == null || v === '') return undefined
        if (typeof v === 'number') return new Date(v).toISOString().replace('T', ' ').slice(0, 19)
        return v
      }
    }

    fields.push({
      fieldId,
      label:
        override?.label ??
        (typeof column.header === 'string' ? column.header : fieldId),
      type,
      source: 'business',
      getValue,
      formatValue: override?.formatValue,
      options: override?.options,
      filterable: override?.filterable ?? true,
      groupable: override?.groupable ?? true,
      colorable: override?.colorable ?? true,
      sortable: override?.sortable ?? true,
      aiReadable: override?.aiReadable ?? true,
    })
  }

  for (const extra of extraFields ?? []) {
    if (fields.some((field) => field.fieldId === extra.fieldId)) continue
    fields.push(extra)
  }

  return fields
}

export function AIWmsDataTable<TRow>(props: AIWmsDataTableProps<TRow>) {
  const aiEnabled = props.enabled ?? true
  if (!aiEnabled) {
    const { aiTable: _aiTable, enabled: _enabled, ...tableProps } = props
    void _enabled
    void _aiTable
    return <WmsDataTable {...tableProps} />
  }
  return <EnabledAIWmsDataTable {...props} />
}

function EnabledAIWmsDataTable<TRow>(props: AIWmsDataTableProps<TRow>) {
  const { aiTable, columns, data, total, getRowId, enabled: _enabled, ...tableProps } = props
  void _enabled
  const {
    tableId,
    rowKey,
    fieldOverrides,
    extraFields,
    dynamicColumnAnchorFieldId,
    switchingLoaderCopy,
    aiAdapter,
  } = aiTable

  const fallbackRowKey = React.useCallback(
    (row: TRow) => String(data.indexOf(row)),
    [data],
  )
  const resolvedRowKey = rowKey ?? getRowId ?? fallbackRowKey

  const config = React.useMemo<AITableConfig<TRow>>(
    () => ({
      tableId,
      rowKey: resolvedRowKey,
      fields: deriveFields(columns, data, fieldOverrides, extraFields),
      aiAdapter,
      demoScope: 'CURRENT_PAGE',
      dynamicColumnAnchorFieldId,
      switchingLoaderCopy,
    }),
    [
      aiAdapter,
      columns,
      data,
      dynamicColumnAnchorFieldId,
      extraFields,
      fieldOverrides,
      resolvedRowKey,
      switchingLoaderCopy,
      tableId,
    ],
  )

  return (
    <AITableProvider config={config} rows={data} totalCount={total}>
      <AITableContent columns={columns} tableProps={{ ...tableProps, getRowId }} />
    </AITableProvider>
  )
}
