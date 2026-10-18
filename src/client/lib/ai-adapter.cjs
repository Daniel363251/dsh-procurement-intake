function createAiAdapter(data, sessionId) {
  const metadata = (fields) => fields.map(({ fieldId, label, type, options }) => ({ fieldId, label, type, options: options ?? [] }))
  return {
    async generateFilters({ instruction, fields }) {
      const allowed = fields.filter((field) => field.aiReadable && field.filterable)
      return data.aiGenerate('filters', { instruction, fields: metadata(allowed) }, sessionId)
    },
    async generateColorRules({ instruction, fields }) {
      const allowed = fields.filter((field) => field.aiReadable && field.colorable)
      return data.aiGenerate('colors', { instruction, fields: metadata(allowed) }, sessionId)
    },
    async previewAIField({ definition, rows, rowKey, fields }) {
      const allowed = definition.referencedFieldIds.map((id) => {
        const field = fields.find((item) => item.fieldId === id && item.aiReadable)
        if (!field) throw new Error(`AI reference must be readable: ${id}`)
        return field
      })
      return data.aiGenerate('field-preview', {
        definition,
        fields: metadata(allowed),
        rows: rows.map((row) => ({ rowKey: rowKey(row), values: Object.fromEntries(allowed.map((field) => [field.fieldId, field.getValue(row)])) })),
      }, sessionId)
    },
  }
}

module.exports = { createAiAdapter }
