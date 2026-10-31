/**
 * AI Table 纯函数引擎
 *
 * 无副作用，所有函数接收输入返回输出，不修改原始数据。
 * 可独立测试，不依赖 React 运行时。
 */

import i18n from '../../i18n'
import type {
  AITableField,
  AITableFilterRule,
  AITableGroupRule,
  AITableSortRule,
  AITableColorRule,
  AITableViewConfig,
  AITableRowProjection,
  AITableGroup,
  AITableFilterOperator,
  AITableColorToken,
} from './types'
import { createDefaultViewConfig } from './types'

// ─── 字段查找 ─────────────────────────────────────────────

export function getFieldById<TRow>(
  fields: AITableField<TRow>[],
  fieldId: string,
): AITableField<TRow> | undefined {
  return fields.find((f) => f.fieldId === fieldId)
}

// ─── 筛选 ─────────────────────────────────────────────────

/** 判断单个值是否满足操作符条件 */
export function matchOperator(
  fieldValue: unknown,
  operator: AITableFilterOperator,
  ruleValue: unknown,
  fieldType?: AITableField<unknown>['type'],
): boolean {
  const normalizedRuleValue =
    (fieldType === 'date' || fieldType === 'datetime') && ruleValue === 'today'
      ? formatLocalDate(new Date())
      : ruleValue

  const normalizedFieldValue =
    (fieldType === 'date' || fieldType === 'datetime') && typeof fieldValue === 'string'
      ? fieldValue.slice(0, 10)
      : fieldValue

  switch (operator) {
    case 'isEmpty':
      return normalizedFieldValue == null || normalizedFieldValue === ''
    case 'notEmpty':
      return normalizedFieldValue != null && normalizedFieldValue !== ''
    case 'equals':
      return String(normalizedFieldValue ?? '') === String(normalizedRuleValue ?? '')
    case 'notEquals':
      return String(normalizedFieldValue ?? '') !== String(normalizedRuleValue ?? '')
    case 'contains':
      return String(normalizedFieldValue ?? '')
        .toLowerCase()
        .includes(String(normalizedRuleValue ?? '').toLowerCase())
    case 'notContains':
      return !String(normalizedFieldValue ?? '')
        .toLowerCase()
        .includes(String(normalizedRuleValue ?? '').toLowerCase())
    case 'greaterThan': {
      if (fieldType === 'date' || fieldType === 'datetime') {
        return String(normalizedFieldValue ?? '') > String(normalizedRuleValue ?? '')
      }
      const n = Number(normalizedFieldValue)
      const r = Number(normalizedRuleValue)
      if (isNaN(n) || isNaN(r)) return false
      return n > r
    }
    case 'lessThan': {
      if (fieldType === 'date' || fieldType === 'datetime') {
        return String(normalizedFieldValue ?? '') < String(normalizedRuleValue ?? '')
      }
      const n = Number(normalizedFieldValue)
      const r = Number(normalizedRuleValue)
      if (isNaN(n) || isNaN(r)) return false
      return n < r
    }
    case 'greaterThanOrEqual': {
      const n = Number(normalizedFieldValue)
      const r = Number(normalizedRuleValue)
      if (isNaN(n) || isNaN(r)) return false
      return n >= r
    }
    case 'lessThanOrEqual': {
      const n = Number(normalizedFieldValue)
      const r = Number(normalizedRuleValue)
      if (isNaN(n) || isNaN(r)) return false
      return n <= r
    }
    case 'between': {
      if (!Array.isArray(normalizedRuleValue) || normalizedRuleValue.length !== 2) return false
      if (fieldType === 'date' || fieldType === 'datetime') {
        const current = String(normalizedFieldValue ?? '')
        const min = String(normalizedRuleValue[0] ?? '')
        const max = String(normalizedRuleValue[1] ?? '')
        return Boolean(min && max && current >= min && current <= max)
      }
      const n = Number(normalizedFieldValue)
      const min = Number(normalizedRuleValue[0])
      const max = Number(normalizedRuleValue[1])
      if (isNaN(n) || isNaN(min) || isNaN(max)) return false
      return n >= min && n <= max
    }
    case 'isToday': {
      if (fieldType !== 'date' && fieldType !== 'datetime') return false
      const today = formatLocalDate(new Date())
      return String(normalizedFieldValue ?? '').slice(0, 10) === today
    }
    case 'isPast': {
      if (fieldType !== 'date' && fieldType !== 'datetime') return false
      const today = formatLocalDate(new Date())
      return String(normalizedFieldValue ?? '').slice(0, 10) < today
    }
    case 'isFuture': {
      if (fieldType !== 'date' && fieldType !== 'datetime') return false
      const today = formatLocalDate(new Date())
      return String(normalizedFieldValue ?? '').slice(0, 10) > today
    }
    case 'withinPastDays': {
      if (fieldType !== 'date' && fieldType !== 'datetime') return false
      const fieldDate = new Date(String(normalizedFieldValue)).getTime()
      if (isNaN(fieldDate)) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((today.getTime() - fieldDate) / 86400000)
      return diffDays >= 0 && diffDays <= Number(normalizedRuleValue)
    }
    case 'withinNextDays': {
      if (fieldType !== 'date' && fieldType !== 'datetime') return false
      const fieldDate = new Date(String(normalizedFieldValue)).getTime()
      if (isNaN(fieldDate)) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((fieldDate - today.getTime()) / 86400000)
      return diffDays >= 0 && diffDays <= Number(normalizedRuleValue)
    }
    default:
      return false
  }
}

/** 对当前页行应用筛选规则，返回过滤后的行 */
export function applyFilters<TRow>(
  rows: TRow[],
  filters: AITableFilterRule[],
  fields: AITableField<TRow>[],
): TRow[] {
  if (!filters.length) return rows

  // 按 conjunction 分组：第一组默认 and，后续每组用自身的 conjunction 与前组连接
  // 简化实现：将所有规则按 or 分割成子组，子组内用 and，子组间用 or
  const orGroups: AITableFilterRule[][] = []
  let currentGroup: AITableFilterRule[] = []

  for (const rule of filters) {
    if (rule.conjunction === 'or' && currentGroup.length > 0) {
      orGroups.push(currentGroup)
      currentGroup = [rule]
    } else {
      currentGroup.push(rule)
    }
  }
  if (currentGroup.length > 0) orGroups.push(currentGroup)

  return rows.filter((row) => {
    return orGroups.some((group) => {
      return group.every((rule) => {
        const field = getFieldById(fields, rule.fieldId)
        if (!field) return true // 字段已下线，跳过该规则
        const value = field.getValue(row)
        return matchOperator(value, rule.operator, rule.value, field.type)
      })
    })
  })
}

// ─── 排序 ─────────────────────────────────────────────────

/**
 * 对当前页行应用稳定的多字段排序。规则顺序即优先级；空值无论升降序都排在末尾。
 */
export function applySorting<TRow>(
  rows: TRow[],
  sorts: AITableSortRule[],
  fields: AITableField<TRow>[],
): TRow[] {
  if (!sorts.length) return rows

  const activeRules = sorts.flatMap((rule) => {
    const field = getFieldById(fields, rule.fieldId)
    return field?.sortable ? [{ rule, field }] : []
  })
  if (!activeRules.length) return rows

  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      for (const { rule, field } of activeRules) {
        const leftValue = field.getValue(left.row)
        const rightValue = field.getValue(right.row)
        const leftEmpty = leftValue == null || leftValue === ''
        const rightEmpty = rightValue == null || rightValue === ''
        if (leftEmpty || rightEmpty) {
          if (leftEmpty && rightEmpty) continue
          return leftEmpty ? 1 : -1
        }
        const compared = compareSortValues(
          leftValue,
          rightValue,
          field,
          left.row,
          right.row,
        )
        if (compared !== 0) return rule.direction === 'desc' ? -compared : compared
      }
      return left.index - right.index
    })
    .map(({ row }) => row)
}

// ─── 分组 ─────────────────────────────────────────────────

/** 空值的分组标签 */
export const UNGROUPED_LABEL = i18n.t('aiTable.engine.ungroupedLabel')

/** 对当前页行应用分组规则，返回分组树 */
export function applyGrouping<TRow>(
  rows: TRow[],
  groups: AITableGroupRule[],
  fields: AITableField<TRow>[],
  collapsedGroupKeys: string[],
): AITableGroup<TRow>[] {
  if (!groups.length) return []

  const maxDepth = Math.min(groups.length, 2)

  function buildGroups(
    data: TRow[],
    depth: number,
    parentKey: string,
  ): AITableGroup<TRow>[] {
    if (depth >= maxDepth) return []
    const rule = groups[depth]
    const field = getFieldById(fields, rule.fieldId)
    if (!field) return []

    // 按 field value 分桶
    const buckets = new Map<string, TRow[]>()
    for (const row of data) {
      const val = field.getValue(row)
      const bucketKey = val == null || val === '' ? '__ungrouped__' : String(val)
      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, [])
      }
      buckets.get(bucketKey)!.push(row)
    }

    // 排序桶
    const sortedKeys = Array.from(buckets.keys()).sort((a, b) => {
      // "__ungrouped__" 始终排最后
      if (a === '__ungrouped__') return 1
      if (b === '__ungrouped__') return -1
      const cmp = a.localeCompare(b, 'zh-CN', { numeric: true })
      return rule.direction === 'desc' ? -cmp : cmp
    })

    return sortedKeys.map((bucketKey) => {
      const groupRows = buckets.get(bucketKey)!
      const firstRow = groupRows[0]
      const label = bucketKey === '__ungrouped__'
        ? UNGROUPED_LABEL
        : field.formatValue?.(field.getValue(firstRow), firstRow) ?? bucketKey
      const fullKey = `${parentKey}${parentKey ? ':' : ''}${rule.fieldId}=${bucketKey}`
      const collapsed = collapsedGroupKeys.includes(fullKey)

      const result: AITableGroup<TRow> = {
        key: fullKey,
        label,
        count: groupRows.length,
        depth,
        collapsed,
        rows: groupRows,
      }

      if (depth + 1 < maxDepth) {
        const children = buildGroups(groupRows, depth + 1, fullKey)
        if (children.length > 0) {
          result.children = children
        }
      }

      return result
    })
  }

  return buildGroups(rows, 0, '')
}

/** 将分组树扁平化为行数组（过滤掉折叠组的行）*/
export function flattenGroups<TRow>(
  groups: AITableGroup<TRow>[],
): { groupHeaders: Array<{ group: AITableGroup<TRow>; isHeader: true }>; rows: TRow[] } {
  const groupHeaders: Array<{ group: AITableGroup<TRow>; isHeader: true }> = []
  const rows: TRow[] = []

  function walk(gs: AITableGroup<TRow>[]) {
    for (const g of gs) {
      groupHeaders.push({ group: g, isHeader: true })
      if (!g.collapsed) {
        if (g.children && g.children.length > 0) {
          walk(g.children)
        } else {
          rows.push(...g.rows)
        }
      }
    }
  }

  walk(groups)
  return { groupHeaders, rows }
}

// ─── 填色 ─────────────────────────────────────────────────

export interface ColorMatchResult {
  rowColor?: AITableColorToken
  rowMarkerColor?: AITableColorToken
  cellColors: Map<string, AITableColorToken>
}

/** 匹配逐行填色规则，返回行级、行侧和单元格级颜色 Token。 */
export function resolveColorRules<TRow>(
  row: TRow,
  colorRules: AITableColorRule[],
  fields: AITableField<TRow>[],
): ColorMatchResult {
  const cellColors = new Map<string, AITableColorToken>()
  let rowColor: AITableColorToken | undefined
  let rowMarkerColor: AITableColorToken | undefined

  // 规则按从上到下顺序判断
  // 单元格规则优先于整行规则
  // 同一目标按顺序第一条命中优先
  for (const rule of colorRules) {
    const field = getFieldById(fields, rule.fieldId)
    if (!field) continue

    const fieldValue = field.getValue(row)
    const matched = matchOperator(fieldValue, rule.operator, rule.value, field.type)
    if (!matched) continue

    if (rule.scope === 'cell') {
      if (!cellColors.has(rule.fieldId)) {
        cellColors.set(rule.fieldId, rule.colorToken)
      }
    } else if (rule.scope === 'row') {
      if (!rowColor) {
        rowColor = rule.colorToken
      }
    } else if (rule.scope === 'rowMarker' && !rowMarkerColor) {
      rowMarkerColor = rule.colorToken
    }
  }

  return { rowColor, rowMarkerColor, cellColors }
}

/** 整列填色不做逐行条件判断，按规则顺序为目标字段选择第一个颜色。 */
export function resolveColumnColorRules(
  colorRules: AITableColorRule[],
): Map<string, AITableColorToken> {
  const columnColors = new Map<string, AITableColorToken>()
  for (const rule of colorRules) {
    if (rule.scope === 'column' && !columnColors.has(rule.fieldId)) {
      columnColors.set(rule.fieldId, rule.colorToken)
    }
  }
  return columnColors
}

// ─── 冻结列归一化 ─────────────────────────────────────────

/** 冻结列数量归一化：至少冻结第一列（下限 1），且至少保留 1 个可滚动列 */
export function normalizeFrozenColumnCount(
  count: number,
  visibleColumnCount: number,
): number {
  // 仅 1 个可见业务列时没有「冻结 1 列 + 保留滚动列」的空间，不启用冻结
  if (visibleColumnCount <= 1) return 0
  // 至少保留 1 个可滚动列
  const maxFrozen = visibleColumnCount - 1
  return Math.min(Math.max(count, 1), maxFrozen)
}

// ─── 草稿检测 ─────────────────────────────────────────────

/** 深度比较两个视图配置是否不同 */
export function isDirty(
  saved: AITableViewConfig,
  draft: AITableViewConfig,
): boolean {
  return JSON.stringify(saved) !== JSON.stringify(draft)
}

// ─── 行投影 ───────────────────────────────────────────────

/** 创建不可变行投影 */
export function createRowProjection<TRow>(
  row: TRow,
  rowKey: string,
  derivedValues: Record<string, unknown>,
  aiValues: Record<string, unknown>,
): AITableRowProjection<TRow> {
  return {
    rowKey,
    source: row,
    derivedValues: { ...derivedValues },
    aiValues: { ...aiValues },
  }
}

// ─── 视图配置归一化 ───────────────────────────────────────

/** 清理引用已下线字段的规则 */
export function normalizeViewConfig<TRow>(
  config: AITableViewConfig | null | undefined,
  fields: AITableField<TRow>[],
): AITableViewConfig {
  const defaults = createDefaultViewConfig()
  if (!config) return defaults

  const aiFields = (config.aiFields ?? []).map((field) => ({
    ...field,
    autoUpdate: field.autoUpdate ?? false,
    allowEmptyReferencedValues: field.allowEmptyReferencedValues ?? false,
  }))
  const fieldIds = new Set([
    ...fields.map((f) => f.fieldId),
    ...aiFields.map((f) => f.fieldId),
  ])
  const sortableFieldIds = new Set([
    ...fields.filter((field) => field.sortable).map((field) => field.fieldId),
    ...aiFields.map((field) => field.fieldId),
  ])

  return {
    filters: (config.filters ?? []).filter((r) => fieldIds.has(r.fieldId)),
    groups: (config.groups ?? []).filter((r) => fieldIds.has(r.fieldId)),
    sorts: (config.sorts ?? []).filter((r) => sortableFieldIds.has(r.fieldId)),
    collapsedGroupKeys: config.collapsedGroupKeys ?? [],
    colorRules: (config.colorRules ?? []).filter((r) =>
      fieldIds.has(r.fieldId),
    ),
    aiFields,
    frozenColumnCount: config.frozenColumnCount ?? 0,
  }
}

// ─── 工具函数 ─────────────────────────────────────────────

/** 生成唯一 ID */
export function generateId(prefix: string = 'rule'): string {
  idSequence += 1
  return `${prefix}_${Date.now().toString(36)}_${idSequence.toString(36)}`
}

/** 获取筛选摘要文案 */
export function getFilterSummary(filters: AITableFilterRule[]): string | null {
  if (!filters.length) return null
  return i18n.t('aiTable.engine.filterSummary', { count: filters.length })
}

/** 获取分组摘要文案 */
export function getGroupSummary(groups: AITableGroupRule[]): string | null {
  if (!groups.length) return null
  return i18n.t('aiTable.engine.groupSummary', { count: groups.length })
}

/** 获取排序摘要文案 */
export function getSortSummary<TRow>(
  sorts: AITableSortRule[],
  fields: AITableField<TRow>[],
): string | null {
  if (!sorts.length) return null
  if (sorts.length > 1) return i18n.t('aiTable.engine.sortSummary', { count: sorts.length })
  const field = getFieldById(fields, sorts[0].fieldId)
  return field
    ? i18n.t('aiTable.engine.sortSummaryByField', { field: field.label.replace('（Demo派生）', '') })
    : i18n.t('aiTable.engine.sortDefault')
}

let idSequence = 0

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function compareSortValues<TRow>(
  left: unknown,
  right: unknown,
  field: AITableField<TRow>,
  leftRow: TRow,
  rightRow: TRow,
): number {
  if (field.type === 'number') {
    const leftNumber = Number(left)
    const rightNumber = Number(right)
    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) return leftNumber - rightNumber
  }

  if (field.type === 'date' || field.type === 'datetime') {
    const leftTime = new Date(String(left)).getTime()
    const rightTime = new Date(String(right)).getTime()
    if (!Number.isNaN(leftTime) && !Number.isNaN(rightTime)) return leftTime - rightTime
  }

  const leftLabel = field.formatValue?.(left, leftRow) ?? String(left)
  const rightLabel = field.formatValue?.(right, rightRow) ?? String(right)
  return leftLabel.localeCompare(rightLabel, 'zh-CN', { numeric: true, sensitivity: 'base' })
}

/** 获取填色摘要文案 */
export function getColorSummary(colorRules: AITableColorRule[]): string | null {
  if (!colorRules.length) return null
  return i18n.t('aiTable.engine.colorSummary', { count: colorRules.length })
}
