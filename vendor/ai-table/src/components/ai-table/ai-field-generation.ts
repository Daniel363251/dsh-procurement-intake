import type { AITableAIField, AITableField } from './types'

/** AI 字段引用中的 null、undefined、空字符串和空数组统一视为空值。 */
export function isEmptyAIFieldReferenceValue(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

export function getEmptyAIFieldReferenceIds<TRow>(
  definition: AITableAIField,
  row: TRow,
  fields: AITableField<TRow>[],
): string[] {
  if (definition.allowEmptyReferencedValues) return []

  return definition.referencedFieldIds.filter((fieldId) => {
    const field = fields.find((candidate) => candidate.fieldId === fieldId)
    return !field || isEmptyAIFieldReferenceValue(field.getValue(row))
  })
}

export function canGenerateAIFieldForRow<TRow>(
  definition: AITableAIField,
  row: TRow,
  fields: AITableField<TRow>[],
): boolean {
  return getEmptyAIFieldReferenceIds(definition, row, fields).length === 0
}

/** 自动更新只比较引用字段，不受行对象其他字段或 AI 字段自身结果影响。 */
export function createAIFieldRowReferenceSignature<TRow>(
  definition: AITableAIField,
  row: TRow,
  fields: AITableField<TRow>[],
): string {
  const referencedFields = definition.referencedFieldIds.map((fieldId) =>
    fields.find((field) => field.fieldId === fieldId),
  )

  return JSON.stringify([
    definition.allowEmptyReferencedValues,
    referencedFields.map((field) => field?.getValue(row) ?? null),
  ])
}
