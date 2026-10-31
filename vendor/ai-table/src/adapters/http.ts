import type { AITableAIAdapter, AITableColorRule, AITableField, AITableFilterRule } from '../components/ai-table/types'
import { getOperatorsByFieldType } from '../components/ai-table/types'
import { COLOR_OPTIONS } from '../components/ai-table/color-palette'

export type AIRequestOperation = 'filters' | 'colors' | 'field-preview'
/** Host handles URL, authentication, authorization, cancellation and response-envelope unwrapping. */
export type AIRequest = (operation: AIRequestOperation, payload: Record<string, unknown>) => Promise<unknown>

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid AI response object')
  return value as Record<string, unknown>
}
function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error('AI response must be an array')
  return value
}
function metadata<TRow>(fields: AITableField<TRow>[]) {
  return fields.map(({ fieldId, label, type, options }) => ({ fieldId, label, type, options }))
}
function validateRule<TRow>(value: unknown, fields: AITableField<TRow>[], capability: 'filterable' | 'colorable') {
  const rule = object(value)
  const field = fields.find((item) => item.fieldId === rule.fieldId && item[capability] && item.aiReadable)
  if (!field) throw new Error(`Unknown or unavailable AI field: ${String(rule.fieldId)}`)
  if (!getOperatorsByFieldType(field.type).some((item) => item.value === rule.operator)) throw new Error('Invalid AI rule operator')
  if (typeof rule.id !== 'string' || !rule.id) throw new Error('AI rule id is required')
  return rule
}

export function createHttpAIAdapter<TRow>({ request }: { request: AIRequest }): AITableAIAdapter<TRow> {
  return {
    async generateFilters({ instruction, fields }) {
      const allowed = fields.filter((field) => field.aiReadable && field.filterable)
      const result = await request('filters', { instruction, fields: metadata(allowed) })
      return array(result).map((item) => {
        const rule = validateRule(item, allowed, 'filterable')
        if (rule.conjunction !== 'and' && rule.conjunction !== 'or') throw new Error('Invalid AI conjunction')
        return { id: rule.id, fieldId: rule.fieldId, operator: rule.operator, value: rule.value, conjunction: rule.conjunction } as AITableFilterRule
      })
    },
    async generateColorRules({ instruction, fields }) {
      const allowed = fields.filter((field) => field.aiReadable && field.colorable)
      const result = await request('colors', { instruction, fields: metadata(allowed) })
      return array(result).map((item) => {
        const rule = validateRule(item, allowed, 'colorable')
        if (!['cell', 'row', 'rowMarker', 'column'].includes(String(rule.scope))) throw new Error('Invalid AI color scope')
        const aliases = ['red', 'lightRed', 'green', 'lightGreen', 'yellow', 'blue', 'lightBlue']
        if (!COLOR_OPTIONS.some((option) => option.value === rule.colorToken) && !aliases.includes(String(rule.colorToken))) throw new Error('Invalid AI color token')
        return { id: rule.id, fieldId: rule.fieldId, operator: rule.operator, value: rule.value, scope: rule.scope, colorToken: rule.colorToken } as AITableColorRule
      })
    },
    async previewAIField({ definition, rows, rowKey, fields }) {
      const allowed = definition.referencedFieldIds.map((id) => {
        const field = fields.find((item) => item.fieldId === id && item.aiReadable)
        if (!field) throw new Error(`AI reference must be readable: ${id}`)
        return field
      })
      const rowKeys = new Set(rows.map(rowKey))
      const result = await request('field-preview', {
        definition, fields: metadata(allowed),
        rows: rows.map((row) => ({ rowKey: rowKey(row), values: Object.fromEntries(allowed.map((field) => [field.fieldId, field.getValue(row)])) })),
      })
      const seen = new Set<string>()
      return array(result).map((item) => {
        const value = object(item)
        if (typeof value.rowKey !== 'string' || !rowKeys.has(value.rowKey) || seen.has(value.rowKey)) throw new Error('Unknown or duplicate AI result row')
        seen.add(value.rowKey)
        if (value.error !== undefined && typeof value.error !== 'string') throw new Error('Invalid AI result error')
        if (!value.error && value.value !== undefined && value.value !== null) {
          if (definition.outputType === 'number' ? typeof value.value !== 'number' || !Number.isFinite(value.value) : typeof value.value !== 'string') throw new Error('AI field result has the wrong output type')
        }
        return { rowKey: value.rowKey, value: value.value, error: value.error as string | undefined }
      })
    },
  }
}
