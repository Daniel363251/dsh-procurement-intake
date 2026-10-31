/**
 * WmsDataTable — WMS 通用数据表格
 *
 * 基于 @tanstack/react-table + shadcn/ui，提炼自 dashboard-01 DataTable：
 * - 服务端分页（manualPagination）
 * - 可配置 Tabs 切换（状态过滤、订单分类等）
 * - 列可见性下拉（Columns 按钮）
 * - Checkbox 多选（供批量操作）
 * - 完整分页控件（首页/上页/下页/末页 + 每页行数）
 * - 无 DnD、无内嵌图表
 */
import * as React from 'react'
import { useTranslation } from '../../i18n'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Columns3Icon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  Settings2,
  RefreshCw,
} from 'lucide-react'

import { Button }   from '../ui/button'
import { useColumnSettings, type WmsColumnField, type WmsColumnSettingsState } from '../../hooks/useColumnSettings'
import { ColumnSettingsDrawer } from './ColumnSettingsDrawer'
import { Checkbox } from '../ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Label }  from '../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Skeleton } from '../ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'

// ─── 类型定义 ───────────────────────────────────────────

export interface WmsTab {
  value: string
  label: string
  /** 可选角标数字（如待审核数量）*/
  count?: number
}

/** 分组数据模型（领域无关，由 AI Table 层传入）*/
export interface WmsDataTableGroup<TData> {
  key: string
  label: string
  count: number
  depth: number
  collapsed: boolean
  rows: TData[]
  children?: WmsDataTableGroup<TData>[]
}

export interface WmsDataTableProps<TData> {
  /** 表格列定义（@tanstack/react-table ColumnDef）*/
  columns: ColumnDef<TData>[]
  /** 当前页数据 */
  data: TData[]
  /** 总记录数（服务端分页用）*/
  total: number
  /** 当前页码（1-indexed）*/
  page: number
  /** 每页条数 */
  pageSize: number
  /** 页码变更回调 */
  onPageChange: (page: number) => void
  /** Optional server-owned sort state. When supplied, sortable headers report changes without sorting the current page locally. */
  serverSorting?: SortingState
  onServerSortingChange?: OnChangeFn<SortingState>
  /** 每页条数变更回调 */
  onPageSizeChange?: (size: number) => void
  /** 每页条数选项，默认 [10, 20, 50, 100] */
  pageSizeOptions?: number[]
  /** Tab 配置（可选，不传则不渲染 Tab 栏）*/
  tabs?: WmsTab[]
  /** 当前激活 Tab 值 */
  activeTab?: string
  /** Tab 切换回调 */
  onTabChange?: (value: string) => void
  /** 选中行变更回调（rowId → true 的 map，rowId 由 getRowId 决定）*/
  onRowSelectionChange?: (selection: RowSelectionState) => void
  /** 受控选中行；传入后由父级负责清空或恢复选择状态 */
  rowSelection?: RowSelectionState
  /** 自定义行 ID（默认用数组下标，建议传业务主键，如 zoneCode）*/
  getRowId?: (row: TData) => string
  /** 行是否可选中（返回 false 时 checkbox 自动 disable）*/
  getRowCanSelect?: (row: TData) => boolean
  /** 加载中状态 */
  loading?: boolean
  /** Reload the current host-owned page. */
  onRefresh?: () => void | Promise<void>
  /** 空数据提示文字 */
  emptyText?: string
  /** 表格右上角额外操作区（如"新建"按钮、导出按钮）*/
  toolbar?: React.ReactNode
  /** 批量操作区（左侧，如批量启用/禁用按钮）*/
  batchActions?: React.ReactNode
  /** 列设置配置（可选，传入则启用列设置功能）*/
  columnSettings?: {
    storageKey: string
    fieldOverrides?: Record<string, Partial<WmsColumnField>>
  }
  /** Hide the column visibility/settings control while retaining its configuration. */
  showColumnControls?: boolean
  /** Stretch the table to the available width when configured columns are narrower. */
  fillWidth?: boolean
  /** 整行条件样式 */
  rowClassName?: (row: TData) => string | undefined
  /** 整行条件内联样式（用于动态色板） */
  rowStyle?: (row: TData) => React.CSSProperties | undefined
  /** 单元格条件样式（覆盖同行背景）*/
  cellClassName?: (
    row: TData,
    columnId: string,
  ) => string | undefined
  /** 单元格条件内联样式（覆盖冻结背景和同行背景） */
  cellStyle?: (row: TData, columnId: string) => React.CSSProperties | undefined
  /** 整列样式，同时作用于表头与该列单元格 */
  columnStyle?: (columnId: string) => React.CSSProperties | undefined
  /** 分组数据（传入则启用分组渲染）*/
  groups?: WmsDataTableGroup<TData>[]
  /** 分组折叠/展开回调 */
  onGroupToggle?: (groupKey: string) => void
  /** 左侧冻结列 ID 列表（必须是可见业务列的连续前缀）*/
  frozenLeftColumnIds?: string[]
  /** 冻结列数量变更回调（传入后启用拖拽调整）*/
  onFrozenColumnCountChange?: (count: number) => void
  /** 冻结列数量下限（拖拽/键盘调整时不允许低于该值），默认 0 */
  minFrozenColumnCount?: number
  /** 表格上方的范围提示（如「当前页演示」）*/
  scopeNote?: React.ReactNode
  /** 工具栏下方内容（如 AI 工具栏），渲染在工具栏和表格之间 */
  belowToolbar?: React.ReactNode
  /** 表格主工具栏左侧的视图级操作 */
  viewToolbar?: React.ReactNode | ((actions: { openColumnSettings: () => void; selectedCount: number }) => React.ReactNode)
  /** 表格主工具栏右侧的视图状态 */
  viewStatus?: React.ReactNode
  /** Notify a smart view when persisted column settings change. */
  onColumnSettingsStateChange?: (state: WmsColumnSettingsState) => void
}

// ─── 列选择辅助函数 ──────────────────────────────────────

/** 在 columns 最前面自动插入 Checkbox 选择列 */
export function withSelectionColumn<T>(
  columns: ColumnDef<T>[],
): ColumnDef<T>[] {
  const selectCol: ColumnDef<T> = {
    id: '__select__',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="全选"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        disabled={!row.getCanSelect()}
        aria-label="选择行"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }
  return [selectCol, ...columns]
}

/** 锚定列 ID：有冻结回调时始终冻结在表格最左侧，不参与列设置排序与字段注册 */
const ANCHOR_COLUMN_IDS = new Set(['__select__', '__index__'])

function isAnchorColumnId(columnId: string): boolean {
  return ANCHOR_COLUMN_IDS.has(columnId)
}

// ─── 主组件 ─────────────────────────────────────────────

export function WmsDataTable<TData>({
  columns,
  data,
  total,
  page,
  pageSize,
  onPageChange,
  serverSorting,
  onServerSortingChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  tabs,
  activeTab,
  onTabChange,
  onRowSelectionChange,
  rowSelection: controlledRowSelection,
  getRowId,
  getRowCanSelect,
  loading = false,
  onRefresh,
  emptyText = '暂无数据',
  toolbar,
  batchActions,
  columnSettings,
  showColumnControls = true,
  fillWidth = false,
  rowClassName,
  rowStyle,
  cellClassName,
  cellStyle,
  columnStyle,
  groups: groupData,
  onGroupToggle,
  frozenLeftColumnIds,
  onFrozenColumnCountChange,
  minFrozenColumnCount,
  scopeNote,
  belowToolbar,
  viewToolbar,
  viewStatus,
  onColumnSettingsStateChange,
}: WmsDataTableProps<TData>) {
  const { t } = useTranslation()
  const [sorting, setSorting]             = React.useState<SortingState>([])
  const [columnFilters]                   = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})
  const rowSelection = controlledRowSelection ?? internalRowSelection
  const [settingsOpen, setSettingsOpen]   = React.useState(false)
  const [renderedColumnWidths, setRenderedColumnWidths] = React.useState<Map<string, number>>(() => new Map())
  const selectedCount = Object.keys(rowSelection).length

  const hasColumnSettings = !!columnSettings

  // 从 columns 自动推导字段元数据（过滤锚定列）
  const fields = React.useMemo<WmsColumnField[]>(() => {
    if (!hasColumnSettings) return []
    return columns
      .filter((col) => {
        const id = col.id ?? ('accessorKey' in col ? String(col.accessorKey) : undefined)
        const stickyRight = (col.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
        return id && !isAnchorColumnId(id) && id !== 'actions' && !stickyRight
      })
      .map((col, index) => {
        const id = String(col.id ?? ('accessorKey' in col ? col.accessorKey : ''))
        const header = typeof col.header === 'string' ? col.header : id
        const overrides = columnSettings?.fieldOverrides?.[id]
        return {
          id,
          label: overrides?.label ?? header,
          group: overrides?.group,
          required: col.enableHiding === false,
          defaultVisible: overrides?.defaultVisible,
          // 第一个业务列锁定位置：不可调整顺序（冻结列语义依赖其稳定在最前）
          ...(index === 0 ? { pinned: true as const } : {}),
        }
      })
  }, [columns, hasColumnSettings, columnSettings])

  // 始终调用 hook（React 规则），无 columnSettings 时安全 no-op
  const colSettings = useColumnSettings({
    storageKey: columnSettings?.storageKey ?? '__noop__',
    fields: hasColumnSettings ? fields : [],
  })
  React.useEffect(() => {
    onColumnSettingsStateChange?.(colSettings.state)
  }, [colSettings.state, onColumnSettingsStateChange])

  // 决定使用哪个 columnVisibility（有配置用 hook，无配置用原 state）
  const effectiveColumnVisibility = hasColumnSettings
    ? colSettings.columnVisibility
    : columnVisibility

  // 构建 columnOrder（锚定列强制前置，其余按列设置 order）
  const effectiveColumnOrder = React.useMemo<string[]>(() => {
    if (!hasColumnSettings) return []
    const anchorIds = columns
      .map((c) => String(c.id ?? ('accessorKey' in c ? c.accessorKey : '')))
      .filter((id) => isAnchorColumnId(id))
    const trailingIds = columns
      .filter((column) => {
        const id = String(column.id ?? ('accessorKey' in column ? column.accessorKey : ''))
        return id === 'actions' || (column.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
      })
      .map((column) => String(column.id ?? ('accessorKey' in column ? column.accessorKey : '')))
    return [
      ...anchorIds,
      ...colSettings.state.order.filter((id) => !isAnchorColumnId(id) && !trailingIds.includes(id)),
      ...trailingIds,
    ]
  }, [hasColumnSettings, columns, colSettings.state.order])

  const renderedColumnOrder = React.useMemo(
    () => effectiveColumnOrder.length
      ? effectiveColumnOrder
      : columns.map((column) => String(column.id ?? ('accessorKey' in column ? column.accessorKey : ''))),
    [columns, effectiveColumnOrder],
  )

  // Freeze counts are persisted by the smart view, while columns may be hidden
  // or reordered independently. Resolve that count against the actual visible
  // business-column order so hidden columns never consume sticky offsets.
  const visibleBusinessColumnIds = React.useMemo(() => {
    const columnById = new Map(
      columns.map((column) => [String(column.id ?? ('accessorKey' in column ? column.accessorKey : '')), column]),
    )
    return renderedColumnOrder.filter((id) => {
      const column = columnById.get(id)
      const isStickyRight = (column?.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
      return Boolean(column)
        && !isAnchorColumnId(id)
        && id !== 'actions'
        && !isStickyRight
        && effectiveColumnVisibility[id] !== false
    })
  }, [columns, renderedColumnOrder, effectiveColumnVisibility])
  const requestedFrozenCount = frozenLeftColumnIds?.length ?? 0
  const maxFrozenCount = Math.max(0, visibleBusinessColumnIds.length - 1)
  const visibleFrozenColumnIds = visibleBusinessColumnIds.slice(0, Math.min(requestedFrozenCount, maxFrozenCount))
  const visibleFrozenSet = React.useMemo(() => new Set(visibleFrozenColumnIds), [visibleFrozenColumnIds])

  // ── 左侧冻结列偏移计算 ──
  const frozenOffsetMap = React.useMemo(() => {
    const map = new Map<string, number>()
    let offset = 0
    // 只累计当前可见且实际参与冻结的列，避免隐藏列留下空白偏移。
    for (const colId of renderedColumnOrder) {
      const col = columns.find((column) => String(column.id ?? ('accessorKey' in column ? column.accessorKey : '')) === colId)
      if (!col || effectiveColumnVisibility[colId] === false) continue
      if (isAnchorColumnId(colId) && onFrozenColumnCountChange) {
        map.set(colId, offset)
        offset += renderedColumnWidths.get(colId) ?? col.size ?? 40
      } else if (visibleFrozenSet.has(colId)) {
        map.set(colId, offset)
        offset += renderedColumnWidths.get(colId) ?? col.size ?? 150
      }
    }
    return map
  }, [columns, renderedColumnOrder, effectiveColumnVisibility, visibleFrozenSet, onFrozenColumnCountChange, renderedColumnWidths])

  const hasFrozenLeft = visibleFrozenColumnIds.length > 0
  const frozenSet = visibleFrozenSet

  // ── 分组扁平化（展开/折叠）──
  const hasGroups = !!groupData && groupData.length > 0
  const flattenedGroupItems = React.useMemo<
    Array<
      | { type: 'groupHeader'; group: WmsDataTableGroup<TData> }
      | { type: 'dataRow'; rowId: string; data: TData }
    >
  >(() => {
    if (!hasGroups || !groupData) return []
    const items: Array<
      | { type: 'groupHeader'; group: WmsDataTableGroup<TData> }
      | { type: 'dataRow'; rowId: string; data: TData }
    > = []
    function walk(gs: WmsDataTableGroup<TData>[]) {
      for (const g of gs) {
        items.push({ type: 'groupHeader', group: g })
        if (!g.collapsed) {
          if (g.children && g.children.length > 0) {
            walk(g.children)
          } else {
            for (const row of g.rows) {
              const rowId = getRowId ? getRowId(row) : String(items.length)
              items.push({ type: 'dataRow', rowId, data: row })
            }
          }
        }
      }
    }
    walk(groupData)
    return items
  }, [hasGroups, groupData, getRowId])

  // ── 冻结列拖拽 ──
  const tableFrameRef = React.useRef<HTMLDivElement>(null)
  const tableWrapperRef = React.useRef<HTMLDivElement>(null)
  const freezeLineRef = React.useRef<HTMLDivElement>(null)
  const freezeTooltipRef = React.useRef<HTMLDivElement>(null)
  const [isFreezeDragging, setIsFreezeDragging] = React.useState(false)
  const [isFreezeHovered, setIsFreezeHovered] = React.useState(false)
  const [isFreezeFocused, setIsFreezeFocused] = React.useState(false)
  const freezePreviewRef = React.useRef<{ count: number; snapX: number } | null>(null)
  const canDragFreeze = !!hasFrozenLeft || !!onFrozenColumnCountChange
  const isFreezeActive = isFreezeDragging || isFreezeHovered || isFreezeFocused
  const lastAnchorColumnId = React.useMemo(() => {
    if (!onFrozenColumnCountChange) return null
    let last: string | null = null
    for (const col of columns) {
      const colId = String(col.id ?? ('accessorKey' in col ? col.accessorKey : ''))
      if (isAnchorColumnId(colId)) last = colId
    }
    return last
  }, [columns, onFrozenColumnCountChange])
  const lastFrozenColumnId = visibleFrozenColumnIds.length
    ? visibleFrozenColumnIds[visibleFrozenColumnIds.length - 1]
    : lastAnchorColumnId

  // fillWidth lets the browser distribute extra table width across columns.
  // Read the rendered header widths so sticky offsets and the freeze handle
  // stay aligned with those expanded cells instead of using configured sizes.
  React.useEffect(() => {
    const wrapper = tableWrapperRef.current
    if (!wrapper) return

    const measure = () => {
      const next = new Map<string, number>()
      wrapper.querySelectorAll<HTMLTableCellElement>('thead th[data-col-id]').forEach((header) => {
        const width = header.getBoundingClientRect().width
        if (width > 0) next.set(header.dataset.colId!, width)
      })
      setRenderedColumnWidths((previous) => {
        if (previous.size === next.size && [...next].every(([id, width]) => Math.abs((previous.get(id) ?? 0) - width) < 0.5)) {
          return previous
        }
        return next
      })
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    const table = wrapper.querySelector('table')
    if (table) observer.observe(table)
    wrapper.querySelectorAll('thead th[data-col-id]').forEach((header) => observer.observe(header))
    return () => observer.disconnect()
  }, [columns, renderedColumnOrder, effectiveColumnVisibility])

  // 冻结边界 X 位置（最后一个冻结列的右边缘）
  const freezeBoundaryX = React.useMemo(() => {
    let x = 0
    for (const colId of renderedColumnOrder) {
      const col = columns.find((column) => String(column.id ?? ('accessorKey' in column ? column.accessorKey : '')) === colId)
      if (!col || effectiveColumnVisibility[colId] === false) continue
      if (isAnchorColumnId(colId) && onFrozenColumnCountChange) {
        x += renderedColumnWidths.get(colId) ?? col.size ?? 40
      } else if (frozenSet.has(colId)) {
        x += renderedColumnWidths.get(colId) ?? col.size ?? 150
      }
    }
    return x
  }, [columns, renderedColumnOrder, effectiveColumnVisibility, frozenSet, onFrozenColumnCountChange, renderedColumnWidths])

  function measureFreezeTarget(clientX: number) {
    const wrapper = tableWrapperRef.current
    if (!wrapper) return null

    const wrapperRect = wrapper.getBoundingClientRect()
    const contentX = clientX - wrapperRect.left + wrapper.scrollLeft
    const headers = Array.from(wrapper.querySelectorAll<HTMLTableCellElement>('thead th'))
    const selection = headers.find((header) => header.dataset.colId === '__select__')
    const businessHeaders = headers.filter((header) => {
      const id = header.dataset.colId
      if (!id || id === '__select__' || id === 'actions') return false
      const column = columns.find((candidate) => String(candidate.id ?? ('accessorKey' in candidate ? candidate.accessorKey : '')) === id)
      return (column?.meta as { sticky?: 'right' } | undefined)?.sticky !== 'right'
    })
    const operationHeader = headers.find((header) => {
      const id = header.dataset.colId
      if (id === 'actions') return true
      const column = columns.find((candidate) => String(candidate.id ?? ('accessorKey' in candidate ? candidate.accessorKey : '')) === id)
      return (column?.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
    })
    const operationBoundaryX = operationHeader
      ? operationHeader.getBoundingClientRect().left - wrapperRect.left
      : wrapper.clientWidth
    const maxFreezeContentX = wrapper.scrollLeft + operationBoundaryX
    const maxCount = Math.max(0, Math.min(
      businessHeaders.length - 1,
      businessHeaders.filter((header) => header.offsetLeft + header.offsetWidth <= maxFreezeContentX).length,
    ))
    const minCount = Math.min(minFrozenColumnCount ?? 0, maxCount)
    let count = 0
    let snapContentX = selection ? selection.offsetLeft + selection.offsetWidth : 0

    for (const header of businessHeaders) {
      if (count >= maxCount) break
      if (contentX >= header.offsetLeft + header.offsetWidth / 2) {
        count += 1
        snapContentX = header.offsetLeft + header.offsetWidth
      } else {
        break
      }
    }

    // 冻结列数下限：拖拽预览与松手结果都不允许低于 minCount
    if (count < minCount) {
      count = minCount
      const boundaryHeader = businessHeaders[count - 1]
      if (boundaryHeader) {
        snapContentX = boundaryHeader.offsetLeft + boundaryHeader.offsetWidth
      }
    }

    // 保留最后一个业务列可横向滚动，同时确保拖拽线始终在操作列左侧。
    const minBoundaryHeader = minCount >= 1 ? businessHeaders[minCount - 1] : undefined
    const maxBoundaryHeader = maxCount > 0 ? businessHeaders[maxCount - 1] : undefined
    const maxBoundaryX = maxBoundaryHeader
      ? maxBoundaryHeader.getBoundingClientRect().right - wrapperRect.left
      : selection
        ? selection.getBoundingClientRect().right - wrapperRect.left
        : 0
    const minimumX = minBoundaryHeader
      ? minBoundaryHeader.getBoundingClientRect().right - wrapperRect.left
      : selection
        ? selection.getBoundingClientRect().right - wrapperRect.left
        : 0

    return {
      count,
      snapX: snapContentX - wrapper.scrollLeft,
      minimumX,
      // Stop before the final scrollable business column and before any
      // sticky-right operation column, even while horizontally scrolled.
      maximumX: Math.max(minimumX, Math.min(wrapper.clientWidth, maxBoundaryX, operationBoundaryX)),
    }
  }

  function updateFreezePointerVisual(
    event: Pick<PointerEvent, 'clientX' | 'clientY'>,
    moveLine: boolean,
  ) {
    const frame = tableFrameRef.current
    const wrapper = tableWrapperRef.current
    const line = freezeLineRef.current
    const tooltip = freezeTooltipRef.current
    if (!frame || !wrapper) return

    const target = measureFreezeTarget(event.clientX)
    const wrapperRect = wrapper.getBoundingClientRect()
    const frameRect = frame.getBoundingClientRect()
    const pointerX = event.clientX - wrapperRect.left
    const lineX = Math.min(
      Math.max(pointerX, target?.minimumX ?? 0),
      target?.maximumX ?? wrapper.clientWidth,
    )

    if (moveLine && line) line.style.left = `${lineX}px`

    if (tooltip) {
      const tooltipWidth = tooltip.offsetWidth || 150
      const preferredLeft = lineX + 14
      const left = preferredLeft + tooltipWidth <= frame.clientWidth - 8
        ? preferredLeft
        : Math.max(8, lineX - tooltipWidth - 14)
      const top = Math.min(
        Math.max(event.clientY - frameRect.top - 15, 8),
        Math.max(8, frame.clientHeight - 38),
      )
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    }
  }

  function handleFreezeDragStart(e: React.PointerEvent) {
    if (!onFrozenColumnCountChange) return
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const dragHandle = e.currentTarget
    const pointerId = e.pointerId
    setIsFreezeDragging(true)
    updateFreezePointerVisual(e.nativeEvent, true)
    const initialTarget = measureFreezeTarget(e.clientX)
    freezePreviewRef.current = initialTarget
      ? { count: initialTarget.count, snapX: initialTarget.snapX }
      : { count: visibleFrozenColumnIds.length, snapX: freezeBoundaryX }
    const previousCursor = document.body.style.cursor
    const previousUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMove = (event: PointerEvent) => {
      const target = measureFreezeTarget(event.clientX)
      if (target) freezePreviewRef.current = { count: target.count, snapX: target.snapX }
      updateFreezePointerVisual(event, true)
    }

    const finishDrag = (event: PointerEvent) => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', finishDrag)
      document.removeEventListener('pointercancel', finishDrag)
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousUserSelect
      if (dragHandle.hasPointerCapture(pointerId)) dragHandle.releasePointerCapture(pointerId)
      setIsFreezeDragging(false)
      setIsFreezeHovered(false)
      const finalTarget = measureFreezeTarget(event.clientX)
      if (finalTarget) {
        freezePreviewRef.current = { count: finalTarget.count, snapX: finalTarget.snapX }
      }
      const nextCount = freezePreviewRef.current?.count ?? visibleFrozenColumnIds.length
      if (freezeLineRef.current) {
        freezeLineRef.current.style.left = `${freezePreviewRef.current?.snapX ?? freezeBoundaryX}px`
      }
      freezePreviewRef.current = null
      onFrozenColumnCountChange(nextCount)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', finishDrag)
    document.addEventListener('pointercancel', finishDrag)
  }

  function handleFreezeKeyDown(event: React.KeyboardEvent) {
    if (!onFrozenColumnCountChange || !['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return
    event.preventDefault()
    const current = visibleFrozenColumnIds.length
    if (event.key === 'Home') onFrozenColumnCountChange(0)
    else onFrozenColumnCountChange(current + (event.key === 'ArrowRight' ? 1 : -1))
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting: serverSorting ?? sorting,
      columnFilters,
      columnVisibility: effectiveColumnVisibility,
      columnOrder: effectiveColumnOrder,
      rowSelection,
    },
    // 服务端分页 — 翻页逻辑交给父组件
    manualPagination: true,
    pageCount: totalPages,
    enableRowSelection: getRowCanSelect
      ? (row) => getRowCanSelect(row.original)
      : true,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      if (controlledRowSelection === undefined) setInternalRowSelection(next)
      onRowSelectionChange?.(next)
    },
    onSortingChange: (updater) => {
      if (!onServerSortingChange) {
        setSorting(updater)
        return
      }
      const current = serverSorting ?? []
      onServerSortingChange(typeof updater === 'function' ? updater(current) : updater)
    },
    manualSorting: serverSorting !== undefined,
    onColumnVisibilityChange: hasColumnSettings ? undefined : setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // 分组标题需要和左侧冻结列共享同一片 sticky 区域，否则横向滚动时标题会被带出视口。
  const visibleLeafColumns = table.getVisibleLeafColumns()
  const groupFrozenColumns = hasFrozenLeft
    ? (() => {
      const result: typeof visibleLeafColumns = []
      for (const column of visibleLeafColumns) {
        const columnId = String(column.id)
        const isFrozen = frozenSet.has(columnId)
          || (isAnchorColumnId(columnId) && !!onFrozenColumnCountChange)
        if (!isFrozen) break
        result.push(column)
      }
      return result
    })()
    : []
  const groupFrozenColumnCount = groupFrozenColumns.length
  const groupFrozenWidth = groupFrozenColumns.reduce((width, column) => width + column.getSize(), 0)
  const groupScrollableColumnCount = visibleLeafColumns.length - groupFrozenColumnCount

  // Tab 切换时重置选中行
  function handleTabChange(value: string) {
    if (controlledRowSelection === undefined) setInternalRowSelection({})
    onTabChange?.(value)
  }

  // ── Tab count 缓存：Tab 切换时不更新 count（防止切换后数字变化）──
  const cachedTabCountsRef = React.useRef<Record<string, number>>({})
  const prevActiveTabRef = React.useRef<string | undefined>(undefined)
  // activeTab 未变（筛选条件变化）时才更新 count；activeTab 变（Tab 切换）时保持旧值
  if (prevActiveTabRef.current === activeTab) {
    for (const tab of (tabs ?? [])) {
      if (tab.count !== undefined) cachedTabCountsRef.current[tab.value] = tab.count
    }
  }
  prevActiveTabRef.current = activeTab
  const displayTabs = (tabs ?? []).map(tab => ({
    ...tab,
    count: cachedTabCountsRef.current[tab.value] ?? tab.count,
  }))

  // ── 单元格样式计算（冻结列 + 条件样式）──
  function getCellClassAndStyle(
    row: TData,
    columnId: string,
    isStickyRightCol: boolean,
    extraRowClass = '',
  ) {
    const isFrozenLeft = (!!hasFrozenLeft && frozenSet.has(columnId)) || (isAnchorColumnId(columnId) && !!onFrozenColumnCountChange)
    const frozenOffset = frozenOffsetMap.get(columnId) ?? 0
    const extraCellClass = cellClassName?.(row, columnId) ?? ''
    const extraCellStyle = cellStyle?.(row, columnId)
    const extraRowStyle = rowStyle?.(row)
    const isFreezeBoundaryCell = isFrozenLeft && columnId === lastFrozenColumnId
    const cellClass = [
      // 行操作菜单会随工作区页签一同隐藏，不能 Portal 到 document.body。
      // 菜单打开时提高所属固定单元格，避免被后续表格行的固定操作列覆盖。
      isStickyRightCol ? 'sticky right-0 z-10 bg-card shadow-[-2px_0_5px_-3px_rgba(17,25,45,0.2)] has-[button[data-state=open]]:z-30' : '',
      isFrozenLeft ? 'sticky z-10 bg-card' : '',
      (isStickyRightCol || isFrozenLeft) ? extraRowClass : '',
      isFreezeBoundaryCell ? 'shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]' : '',
      extraCellClass,
    ].filter(Boolean).join(' ')
    const resolvedCellStyle: React.CSSProperties = {
      ...(isFrozenLeft ? { left: frozenOffset } : {}),
      ...((isFrozenLeft || isStickyRightCol) ? { backgroundColor: 'var(--card)' } : {}),
      ...((isFrozenLeft || isStickyRightCol) ? extraRowStyle : {}),
      ...extraCellStyle,
    }
    return { cellClass, cellStyle: resolvedCellStyle }
  }

  const tabControls = displayTabs.length > 0 ? (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="h-8">
        {displayTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="gap-1.5 px-3 text-xs"
          >
            {tab.label}
            {tab.count !== undefined && (
              <Badge
                variant="secondary"
                className="h-4 rounded-full px-1 text-[10px] font-medium"
              >
                {tab.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  ) : null

  const batchControls = batchActions ? (
    <div className="flex items-center gap-2">
      {batchActions}
    </div>
  ) : null

  const selectedCountBadge = selectedCount > 0 ? (
    <span className="whitespace-nowrap text-sm text-muted-foreground">
      {t('wms.selectedCount', { count: selectedCount })}
    </span>
  ) : null

  const refreshControl = onRefresh ? (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground"
      aria-label={t('common.refresh', '刷新')}
      title={t('common.refresh', '刷新')}
      disabled={loading}
      onClick={() => void onRefresh()}
    >
      <RefreshCw className={`size-4${loading ? ' animate-spin' : ''}`} />
    </Button>
  ) : null

  const columnControls = !showColumnControls ? null : hasColumnSettings ? (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSettingsOpen(true)}
    >
      <Settings2 className="size-4" />
      {t('wms.columnSettings.title', '列设置')}
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns3Icon className="size-4" />
          {t('wms.column', '列')}
          <ChevronDownIcon className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={col.getIsVisible()}
              onCheckedChange={(v) => col.toggleVisibility(!!v)}
            >
              {typeof col.columnDef.header === 'string'
                ? col.columnDef.header
                : col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
  const toolbarActions = <>{refreshControl}{toolbar}{columnControls}</>
  // 选中计数在传入 viewToolbar 时改由其回调渲染（见上），仅无 viewToolbar 时计入业务工具栏。
  const hasBusinessToolbarContent = Boolean(
    tabControls || batchControls || refreshControl || toolbar || columnControls || (!viewToolbar && selectedCountBadge),
  )

  return (
    <div className="flex w-full flex-col gap-0">
      {viewToolbar ? (
        <>
          {/* 视图级操作：只负责智能表格的组织与展示配置 */}
          <div role="toolbar" aria-label="智能表格视图操作" className="flex items-center justify-between gap-4 overflow-x-auto px-4 py-2.5 lg:px-6">
            <div className="flex min-w-max items-center gap-2">
              {typeof viewToolbar === 'function' ? viewToolbar({ openColumnSettings: () => setSettingsOpen(true), selectedCount }) : viewToolbar}
            </div>
            {viewStatus ? <div className="flex min-w-max items-center gap-2">{viewStatus}</div> : null}
          </div>
          {/* 数据级操作：业务批量操作、刷新、导出和列设置 */}
          {hasBusinessToolbarContent ? (
            <div role="toolbar" aria-label="业务数据操作" className="flex items-center justify-between gap-4 overflow-x-auto border-t bg-muted/10 px-4 py-2.5 lg:px-6">
              <div className="flex min-w-max items-center gap-3">{tabControls}{batchControls}</div>
              <div className="flex min-w-max items-center gap-2">{toolbarActions}</div>
            </div>
          ) : null}
        </>
      ) : (
        /* 传统表格保持单行工具栏 */
        <div role="toolbar" aria-label="业务数据操作" className="flex items-center justify-between gap-4 overflow-x-auto px-4 py-3 lg:px-6">
          <div className="flex min-w-max items-center gap-3">{selectedCountBadge}{tabControls}{batchControls}</div>
          <div className="flex min-w-max items-center gap-2">{toolbarActions}</div>
        </div>
      )}

      {/* ── 工具栏下方内容（如 AI 工具栏）── */}
      {belowToolbar && (
        <div className="border-t">{belowToolbar}</div>
      )}

      {/* ── 范围提示 ── */}
      {scopeNote && (
        <div className="border-t bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground lg:px-6">
          {scopeNote}
        </div>
      )}

      {/* ── 表格 ── */}
      <div ref={tableFrameRef} className="relative border-t">
        {!loading && canDragFreeze ? (
          <>
            <div
              ref={freezeLineRef}
              role="separator"
              aria-label={t('wms.freeze.dragLabel', '拖拽调整左侧冻结列')}
              aria-orientation="vertical"
              aria-valuemin={minFrozenColumnCount ?? 0}
              aria-valuenow={visibleFrozenColumnIds.length}
              aria-describedby="freeze-column-drag-tooltip"
              tabIndex={0}
              className={`group absolute inset-y-0 z-30 flex w-3 -translate-x-1/2 cursor-col-resize touch-none items-start justify-center outline-none transition-colors hover:text-primary ${isFreezeActive ? 'text-primary' : 'text-border'}`}
              style={{ left: freezeBoundaryX }}
              onPointerDown={handleFreezeDragStart}
              onPointerEnter={(event) => {
                updateFreezePointerVisual(event.nativeEvent, false)
                setIsFreezeHovered(true)
              }}
              onPointerMove={(event) => {
                updateFreezePointerVisual(event.nativeEvent, isFreezeDragging)
                setIsFreezeHovered(true)
              }}
              onPointerLeave={() => {
                if (!isFreezeDragging) setIsFreezeHovered(false)
              }}
              onFocus={() => setIsFreezeFocused(true)}
              onBlur={() => setIsFreezeFocused(false)}
              onKeyDown={handleFreezeKeyDown}
            >
              <span className="h-full w-px bg-current transition-colors" />
              <span className={`absolute top-8 flex h-7 w-3 items-center justify-center rounded-full bg-primary shadow-sm ring-primary/25 transition-all group-hover:scale-100 group-hover:opacity-100 ${isFreezeActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} ${isFreezeFocused ? 'ring-4' : ''}`}>
                <span className="h-3 w-px bg-primary-foreground/90" />
              </span>
            </div>
            <div
              ref={freezeTooltipRef}
              id="freeze-column-drag-tooltip"
              role="tooltip"
              className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md transition-opacity ${isFreezeHovered || isFreezeDragging ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: freezeBoundaryX + 14, top: 8 }}
            >
              {t('wms.freeze.tooltip', '拖拽可调整冻结区域')}
            </div>
          </>
        ) : null}
        <div
          ref={tableWrapperRef}
          className={`w-full min-w-0 overflow-x-auto${canDragFreeze ? ' [&>[data-slot=table-container]]:overflow-visible' : ''}`}
          data-density={hasColumnSettings ? colSettings.density : undefined}
        >
        {loading ? (
          <div>
            {/* Skeleton header */}
            <div className="flex items-center gap-2 border-b bg-muted/60 px-2 py-2.5">
              {Array.from({ length: Math.min(columns.length, 6) }).map((_, i) => (
                <Skeleton key={i} className="h-3.5" style={{ width: `${60 + (i * 37) % 80}px` }} />
              ))}
            </div>
            {/* Skeleton rows */}
            {Array.from({ length: pageSize > 8 ? 8 : pageSize }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className={`flex items-center gap-2 border-b px-2 py-2 ${rowIdx % 2 === 0 ? 'bg-muted/20' : ''}`}
              >
                {Array.from({ length: Math.min(columns.length, 6) }).map((_, colIdx) => (
                  <Skeleton
                    key={colIdx}
                    className="h-3.5"
                    style={{ width: `${40 + ((rowIdx * 13 + colIdx * 29) % 80)}px` }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <Table
            className="table-fixed"
            style={{ minWidth: table.getTotalSize(), width: fillWidth ? '100%' : table.getTotalSize() }}
          >
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => {
                    const colId = String(header.column.id)
                    const isStickyRight = (header.column.columnDef.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
                    const isFrozenLeft = (!!hasFrozenLeft && frozenSet.has(colId)) || (isAnchorColumnId(colId) && !!onFrozenColumnCountChange)
                    const frozenOffset = frozenOffsetMap.get(colId) ?? 0
                    const headerClass = isStickyRight
                      ? 'sticky right-0 z-20 bg-muted shadow-[-2px_0_5px_-3px_rgba(17,25,45,0.2)]'
                      : isFrozenLeft
                        ? `sticky z-20 bg-muted${colId === lastFrozenColumnId ? ' shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]' : ''}`
                        : ''
                    const headerStyle: React.CSSProperties = {
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                      ...(isFrozenLeft ? { left: frozenOffset } : {}),
                      ...columnStyle?.(colId),
                    }
                    return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={headerStyle}
                      className={headerClass}
                      data-col-id={colId}
                      aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
                    >
                      {header.isPlaceholder
                        ? null
                        : serverSorting !== undefined && header.column.getCanSort()
                          ? (
                            <button
                              type="button"
                              className="flex w-full items-center justify-between gap-2 text-left"
                              onClick={header.column.getToggleSortingHandler()}
                              aria-label={`按${String(header.column.columnDef.header ?? colId)}排序`}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getIsSorted() === 'asc' ? <ArrowUp className="size-3.5 shrink-0" aria-hidden="true" />
                                : header.column.getIsSorted() === 'desc' ? <ArrowDown className="size-3.5 shrink-0" aria-hidden="true" />
                                  : <ArrowUpDown className="size-3.5 shrink-0 opacity-50" aria-hidden="true" />}
                            </button>
                          )
                          : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {hasGroups ? (
                /* ── 分组渲染 ── */
                flattenedGroupItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      {emptyText}
                    </TableCell>
                  </TableRow>
                ) : (
                  flattenedGroupItems.map((item) => {
                    if (item.type === 'groupHeader') {
                      const groupRowIds = item.group.rows
                        .filter((groupRow) => !getRowCanSelect || getRowCanSelect(groupRow))
                        .map((groupRow) => getRowId ? getRowId(groupRow) : String(data.indexOf(groupRow)))
                        .filter((rowId) => rowId !== '-1')
                      const selectedGroupRows = groupRowIds.filter((rowId) => !!rowSelection[rowId]).length
                      const allGroupRowsSelected = groupRowIds.length > 0 && selectedGroupRows === groupRowIds.length
                      const someGroupRowsSelected = selectedGroupRows > 0
                      const groupCheckboxState = allGroupRowsSelected ? true : someGroupRowsSelected ? 'indeterminate' : false
                      const groupLabel = (
                        <div className="flex min-w-0 items-center gap-1.5" style={{ paddingLeft: item.group.depth * 16 }}>
                          <Checkbox
                            checked={groupCheckboxState}
                            disabled={groupRowIds.length === 0}
                            onCheckedChange={(checked) => {
                              const shouldSelect = checked === true
                              table.setRowSelection((previous) => {
                                const next = { ...previous }
                                for (const rowId of groupRowIds) {
                                  if (shouldSelect) next[rowId] = true
                                  else delete next[rowId]
                                }
                                return next
                              })
                            }}
                            aria-label={t('wms.group.selectRows', { label: item.group.label, count: groupRowIds.length })}
                          />
                          <button
                            type="button"
                            className="flex size-4 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label={`${item.group.collapsed ? '展开' : '折叠'}分组 ${item.group.label}`}
                            onClick={() => onGroupToggle?.(item.group.key)}
                          >
                            <svg
                              aria-hidden="true"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ display: 'block', flex: '0 0 16px', height: 16, width: 16 }}
                            >
                              <path d={item.group.collapsed ? 'm9 18 6-6-6-6' : 'm6 9 6 6 6-6'} />
                            </svg>
                          </button>
                          <span className="truncate text-sm font-semibold">{item.group.label}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">({item.group.count})</span>
                        </div>
                      )
                      return (
                        <TableRow key={`gh-${item.group.key}`} className="bg-muted/40 hover:bg-muted/40">
                          {groupFrozenColumnCount > 0 ? (
                            <>
                              <TableCell
                                colSpan={groupFrozenColumnCount}
                                className="sticky left-0 z-20 overflow-hidden bg-muted py-2 font-medium shadow-[3px_0_7px_-4px_rgba(17,25,45,0.28)]"
                                style={{ width: groupFrozenWidth, minWidth: groupFrozenWidth, maxWidth: groupFrozenWidth }}
                              >
                                {groupLabel}
                              </TableCell>
                              {groupScrollableColumnCount > 0 ? (
                                <TableCell colSpan={groupScrollableColumnCount} className="bg-muted/40 p-0" aria-hidden="true" />
                              ) : null}
                            </>
                          ) : (
                            <TableCell colSpan={visibleLeafColumns.length} className="py-2 font-medium">
                              {groupLabel}
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    }
                    const tableRow = table.getRowModel().rowsById[item.rowId]
                    if (!tableRow) return null
                    const extraRowClass = rowClassName?.(tableRow.original)
                    return (
                      <TableRow
                        key={`gr-${item.rowId}`}
                        data-state={tableRow.getIsSelected() ? 'selected' : undefined}
                        className={['bg-card', extraRowClass].filter(Boolean).join(' ')}
                        style={rowStyle?.(tableRow.original)}
                      >
                        {tableRow.getVisibleCells().map((cell) => {
                          const rawValue = cell.getValue()
                          const isStickyR = (cell.column.columnDef.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
                          const { cellClass, cellStyle } = getCellClassAndStyle(
                            tableRow.original,
                            String(cell.column.id),
                            isStickyR,
                            extraRowClass,
                          )
                          return (
                            <TableCell
                              key={cell.id}
                              className={`${cellClass} overflow-hidden text-ellipsis`}
                              title={typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue) : undefined}
                              style={{
                                ...cellStyle,
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })
                )
              ) : (
                /* ── 普通渲染（无分组）── */
                table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {emptyText}
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const extraRowClass = rowClassName?.(row.original)
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() ? 'selected' : undefined}
                        className={['bg-card', extraRowClass].filter(Boolean).join(' ')}
                        style={rowStyle?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const rawValue = cell.getValue()
                          const isStickyR = (cell.column.columnDef.meta as { sticky?: 'right' } | undefined)?.sticky === 'right'
                          const { cellClass, cellStyle } = getCellClassAndStyle(
                            row.original,
                            String(cell.column.id),
                            isStickyR,
                            extraRowClass,
                          )
                          return (
                            <TableCell
                              key={cell.id}
                              className={`${cellClass} overflow-hidden text-ellipsis`}
                              title={typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue) : undefined}
                              style={{
                                ...cellStyle,
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })
                )
              )}
            </TableBody>
          </Table>
        )}
        </div>
      </div>

      {/* ── 分页 ── */}
      <div className="flex items-center justify-between border-t px-4 py-3 lg:px-6">
        {/* 左：选中行数 */}
        <div className="hidden text-xs text-muted-foreground lg:block">
          {Object.keys(rowSelection).length > 0
            ? t('wms.pagination.selectedRows', { selected: Object.keys(rowSelection).length, total })
            : t('wms.pagination.totalRecords', { total })}
        </div>

        <div className="flex w-full items-center gap-6 lg:w-auto">
          {/* 每页行数 */}
          {onPageSizeChange && (
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-xs text-muted-foreground whitespace-nowrap">
                {t('wms.pagination.rowsPerPage', '每页行数')}
              </Label>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  onPageSizeChange(Number(v))
                }}
                disabled={loading}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {pageSizeOptions.map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 页码 */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            {t('wms.pagination.pageInfo', { page, total: totalPages })}
          </div>

          {/* 翻页按钮 */}
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-7 lg:flex"
              onClick={() => onPageChange(1)}
              disabled={loading || page <= 1}
            >
              <span className="sr-only">{t('common.label.firstPage', '首页')}</span>
              <ChevronsLeftIcon className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => onPageChange(page - 1)}
              disabled={loading || page <= 1}
            >
              <span className="sr-only">{t('common.label.prevPage', '上一页')}</span>
              <ChevronLeftIcon className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => onPageChange(page + 1)}
              disabled={loading || page >= totalPages}
            >
              <span className="sr-only">{t('common.label.nextPage', '下一页')}</span>
              <ChevronRightIcon className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-7 lg:flex"
              onClick={() => onPageChange(totalPages)}
              disabled={loading || page >= totalPages}
            >
              <span className="sr-only">{t('common.label.lastPage', '末页')}</span>
              <ChevronsRightIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── 列设置抽屉 ── */}
      {hasColumnSettings && (
        <ColumnSettingsDrawer
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          fields={fields}
          state={colSettings.state}
          defaultState={colSettings.defaultState}
          onApply={colSettings.applyState}
        />
      )}
    </div>
  )
}
