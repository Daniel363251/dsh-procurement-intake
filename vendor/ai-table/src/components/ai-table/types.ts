/**
 * AI Table 核心类型定义
 *
 * 完全对齐 16-05-ai-table-static-demo-spec.md § 5 的类型契约。
 * 通用组件禁止 import 业务 DTO，所有业务信息通过泛型 TRow 传递。
 */
import i18n from '../../i18n'

// ─── 字段注册 ─────────────────────────────────────────────

export type AITableFieldType = 'text' | 'number' | 'tag' | 'date' | 'datetime'

export type AITableFieldSource = 'business' | 'derived' | 'ai'

export interface AITableFieldOption {
  value: string | number | boolean
  label: string
}

export interface AITableField<TRow> {
  /** 稳定唯一字段 ID，同一 tableId 下不可重复 */
  fieldId: string
  /** 展示名称 */
  label: string
  /** 字段类型 */
  type: AITableFieldType
  /** 来源：业务字段 / Demo 派生 / AI 生成 */
  source: AITableFieldSource
  /** 从行数据中取值，不可修改 row */
  getValue: (row: TRow) => unknown
  /** 可筛选 */
  filterable: boolean
  /** 可分组 */
  groupable: boolean
  /** 可填色判断 */
  colorable: boolean
  /** 可排序 */
  sortable: boolean
  /** 可被 AI 字段引用 */
  aiReadable: boolean
  /** 将原始值转换为用于分组标题和动态列的展示文案 */
  formatValue?: (value: unknown, row: TRow) => string
  /** 枚举型字段的可选值；声明后筛选、填色等规则编辑器统一使用下拉选择 */
  options?: AITableFieldOption[]
}

// ─── 筛选规则 ─────────────────────────────────────────────

export type AITableFilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'isEmpty'
  | 'notEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'isToday'
  | 'isPast'
  | 'isFuture'
  | 'withinPastDays'
  | 'withinNextDays'

export type AITableConjunction = 'and' | 'or'

export interface AITableFilterRule {
  id: string
  fieldId: string
  operator: AITableFilterOperator
  value?: unknown
  conjunction: AITableConjunction
}

// ─── 分组规则 ─────────────────────────────────────────────

export interface AITableGroupRule {
  fieldId: string
  direction: 'asc' | 'desc'
}

// ─── 排序规则 ─────────────────────────────────────────────

export interface AITableSortRule {
  fieldId: string
  direction: 'asc' | 'desc'
}

// ─── 填色规则 ─────────────────────────────────────────────

export type AITableColorScope = 'cell' | 'row' | 'rowMarker' | 'column'

/** 使用 CSS Token 名称，不存硬编码 hex */
export type AITablePaletteColorFamily =
  | 'coral'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray'

export type AITablePaletteColorShade = 1 | 2 | 3 | 4 | 5

export type AITableColorToken =
  | 'red'
  | 'lightRed'
  | 'green'
  | 'lightGreen'
  | 'yellow'
  | 'blue'
  | 'lightBlue'
  | `${AITablePaletteColorFamily}${AITablePaletteColorShade}`

export interface AITableColorRule {
  id: string
  scope: AITableColorScope
  fieldId: string
  operator: AITableFilterOperator
  value?: unknown
  colorToken: AITableColorToken
}

// ─── AI 字段 ──────────────────────────────────────────────

export type AITableAIFieldOutputType = 'text' | 'number' | 'tag'

export interface AITableAIField {
  fieldId: string
  name: string
  outputType: AITableAIFieldOutputType
  prompt: string
  referencedFieldIds: string[]
  /** 引用字段值变化时自动重新生成对应行结果。 */
  autoUpdate: boolean
  /** 为 false 时，任一引用字段为空的行跳过生成。 */
  allowEmptyReferencedValues: boolean
}

// ─── 视图配置 ─────────────────────────────────────────────

export interface AITableViewConfig {
  filters: AITableFilterRule[]
  groups: AITableGroupRule[]
  sorts: AITableSortRule[]
  collapsedGroupKeys: string[]
  colorRules: AITableColorRule[]
  aiFields: AITableAIField[]
  frozenColumnCount: number
}

// ─── 行投影（原始数据不可变）─────────────────────────────

export interface AITableRowProjection<TRow> {
  rowKey: string
  source: TRow
  derivedValues: Record<string, unknown>
  aiValues: Record<string, unknown>
}

// ─── 分组结果 ─────────────────────────────────────────────

export interface AITableGroup<TRow> {
  key: string
  label: string
  count: number
  depth: number
  collapsed: boolean
  rows: TRow[]
  children?: AITableGroup<TRow>[]
}

// ─── Mock AI 适配器 ───────────────────────────────────────

export interface AITableAIAdapter<TRow> {
  generateFilters(input: {
    instruction: string
    fields: AITableField<TRow>[]
  }): Promise<AITableFilterRule[]>

  generateColorRules(input: {
    instruction: string
    fields: AITableField<TRow>[]
  }): Promise<AITableColorRule[]>

  previewAIField(input: {
    definition: AITableAIField
    rows: TRow[]
    rowKey: (row: TRow) => string
    fields: AITableField<TRow>[]
  }): Promise<Array<{ rowKey: string; value?: unknown; error?: string }>>
}

// ─── 页面接入配置 ─────────────────────────────────────────

export interface AITableConfig<TRow> {
  tableId: string
  rowKey: (row: TRow) => string
  fields: AITableField<TRow>[]
  aiAdapter: AITableAIAdapter<TRow>
  demoScope: 'CURRENT_PAGE'
  /** 动态派生/AI 列插入到该业务列之后；未配置时追加到操作列之前 */
  dynamicColumnAnchorFieldId?: string
  /** 切换加载态的业务化文案；未配置时使用通用文案。 */
  switchingLoaderCopy?: AITableSwitchingLoaderCopy
}

// ─── Provider 状态 ────────────────────────────────────────

export type AITableMode = 'classic' | 'smart'

export type AITableModeTransition = 'idle' | 'switching-to-smart'

export interface AITableSwitchingLoaderCopy {
  title?: string
  subtitle?: string
  statusText?: string
  askText?: string
}

export type AITableActivePanel =
  | 'filter'
  | 'group'
  | 'sort'
  | 'color'
  | 'aiField'
  | null

export type AITableGenerationState =
  | 'idle'
  | 'generating'
  | 'success'
  | 'error'

export interface AITableState {
  mode: AITableMode
  modeTransition: AITableModeTransition
  savedView: AITableViewConfig
  draftView: AITableViewConfig
  activePanel: AITableActivePanel
  generationState: AITableGenerationState
  dirty: boolean
}

// ─── 默认视图配置 ─────────────────────────────────────────

export function createDefaultViewConfig(): AITableViewConfig {
  return {
    filters: [],
    groups: [],
    sorts: [],
    collapsedGroupKeys: [],
    colorRules: [],
    aiFields: [],
    // 默认冻结第一个业务列（如出库单号/库存编码），拖拽条停靠在其右侧
    frozenColumnCount: 1,
  }
}

// ─── 操作符元数据 ─────────────────────────────────────────

export interface OperatorMeta {
  value: AITableFilterOperator
  label: string
}

/** 按字段类型返回可用操作符 */
export function getOperatorsByFieldType(type: AITableFieldType): OperatorMeta[] {
  switch (type) {
    case 'text':
      return [
        { value: 'equals', label: i18n.t('aiTable.operators.equals') },
        { value: 'notEquals', label: i18n.t('aiTable.operators.notEquals') },
        { value: 'contains', label: i18n.t('aiTable.operators.contains') },
        { value: 'notContains', label: i18n.t('aiTable.operators.notContains') },
        { value: 'isEmpty', label: i18n.t('aiTable.operators.isEmpty') },
        { value: 'notEmpty', label: i18n.t('aiTable.operators.notEmpty') },
      ]
    case 'number':
      return [
        { value: 'equals', label: i18n.t('aiTable.operators.equals') },
        { value: 'notEquals', label: i18n.t('aiTable.operators.notEquals') },
        { value: 'greaterThan', label: i18n.t('aiTable.operators.greaterThan') },
        { value: 'lessThan', label: i18n.t('aiTable.operators.lessThan') },
        { value: 'greaterThanOrEqual', label: i18n.t('aiTable.operators.greaterThanOrEqual') },
        { value: 'lessThanOrEqual', label: i18n.t('aiTable.operators.lessThanOrEqual') },
        { value: 'between', label: i18n.t('aiTable.operators.between') },
        { value: 'isEmpty', label: i18n.t('aiTable.operators.isEmpty') },
      ]
    case 'tag':
      return [
        { value: 'equals', label: i18n.t('aiTable.operators.equals') },
        { value: 'notEquals', label: i18n.t('aiTable.operators.notEquals') },
        { value: 'isEmpty', label: i18n.t('aiTable.operators.isEmpty') },
        { value: 'notEmpty', label: i18n.t('aiTable.operators.notEmpty') },
      ]
    case 'date':
    case 'datetime':
      return [
        { value: 'equals', label: i18n.t('aiTable.operators.equals') },
        { value: 'notEquals', label: i18n.t('aiTable.operators.notEquals') },
        { value: 'greaterThan', label: i18n.t('aiTable.operators.earlierThan') },
        { value: 'lessThan', label: i18n.t('aiTable.operators.laterThan') },
        { value: 'between', label: i18n.t('aiTable.operators.between') },
        { value: 'isToday', label: i18n.t('aiTable.operators.isToday') },
        { value: 'isPast', label: i18n.t('aiTable.operators.isPast') },
        { value: 'isFuture', label: i18n.t('aiTable.operators.isFuture') },
        { value: 'withinPastDays', label: i18n.t('aiTable.operators.withinPastDays') },
        { value: 'withinNextDays', label: i18n.t('aiTable.operators.withinNextDays') },
        { value: 'isEmpty', label: i18n.t('aiTable.operators.isEmpty') },
        { value: 'notEmpty', label: i18n.t('aiTable.operators.notEmpty') },
      ]
    default:
      return [{ value: 'equals', label: i18n.t('aiTable.operators.equals') }]
  }
}
