import * as React from 'react'
import { useTranslation } from '../../i18n'
import { GripVertical, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FieldSelectItem } from './FieldTypeIcon'
import { AIPromptInput, PanelFooter, PanelHeader } from './AITablePanelParts'
import { AITableValueEditor } from './AITableValueEditor'
import { ColorPalettePicker, ColorScopePicker } from './AIColorControls'
import { useAITable } from './AITableProvider'
import { generateId } from './ai-table-engine'
import { getOperatorsByFieldType } from './types'
import type { AITableColorRule } from './types'

export function AIColorPanel() {
  const { t } = useTranslation()
  const { config, draftFields, state, updateDraft, setGenerationState } = useAITable()
  const rules = state.draftView.colorRules
  const fields = draftFields.filter((field) => field.colorable)
  const [instruction, setInstruction] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const generating = state.generationState === 'generating'
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)

  async function generate() {
    if (!instruction.trim() || generating) return
    setGenerationState('generating')
    try {
      const generated = await config.aiAdapter.generateColorRules({ instruction, fields: draftFields })
      if (generated.length) {
        updateDraft({ colorRules: [...rules, ...generated] })
        setMessage(t('aiTable.color.generated', { count: generated.length }))
      } else setMessage(t('aiTable.color.noRules'))
      setGenerationState('success')
    } catch (error) {
      const detail = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
      setMessage(detail || t('aiTable.color.generateFailed'))
      setGenerationState('error')
    }
  }

  function addRule() {
    const field = fields.find((item) => /shortage|缺货/i.test(`${item.fieldId} ${item.label}`))
      ?? fields.find((item) => item.source === 'derived')
      ?? fields[0]
    if (!field) return
    updateDraft({ colorRules: [...rules, {
      id: generateId('color'),
      scope: 'cell',
      fieldId: field.fieldId,
      operator: field.type === 'number' ? 'greaterThan' : 'equals',
      value: field.type === 'number' ? 0 : '',
      colorToken: 'red',
    }] })
  }

  function updateRule(id: string, patch: Partial<AITableColorRule>) {
    updateDraft({ colorRules: rules.map((rule) => rule.id === id ? { ...rule, ...patch } : rule) })
  }

  function reorder(toIndex: number) {
    if (draggedIndex == null || draggedIndex === toIndex) return
    const next = [...rules]
    const [moved] = next.splice(draggedIndex, 1)
    next.splice(toIndex, 0, moved)
    updateDraft({ colorRules: next })
    setDraggedIndex(toIndex)
  }

  return (
    <div className="bg-popover">
      <PanelHeader title={t('aiTable.color.title')} />
      <div className="space-y-4 p-4">
        <AIPromptInput
          value={instruction}
          onChange={setInstruction}
          onSubmit={generate}
          loading={generating}
          placeholder={t('aiTable.color.placeholder')}
        />
        {generating ? <p className="flex items-center gap-2 text-xs text-primary"><Loader2 className="size-3.5 animate-spin" />{t('aiTable.color.generating')}</p> : null}
        {message && !generating ? <p className="text-xs text-description">{message}</p> : null}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{t('aiTable.color.ruleDescription')}</p>
            <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs text-description"><Sparkles className="size-3.5" />{t('aiTable.color.smartColor')}</Button>
          </div>
          <div className="space-y-2">
            {rules.map((rule, index) => {
              const field = draftFields.find((item) => item.fieldId === rule.fieldId)
              const operators = field ? getOperatorsByFieldType(field.type) : []
              return (
                <div
                  key={rule.id}
                  onDragOver={(event) => { event.preventDefault(); reorder(index) }}
                  className="relative flex items-center gap-2"
                >
                  <button
                    type="button"
                    draggable
                    className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
                    aria-label={t('aiTable.color.dragHint', { index: index + 1 })}
                    onDragStart={() => setDraggedIndex(index)}
                    onDragEnd={() => setDraggedIndex(null)}
                  >
                    <GripVertical className="size-4" />
                  </button>
                  <ColorPalettePicker
                    value={rule.colorToken}
                    onChange={(colorToken) => updateRule(rule.id, { colorToken })}
                  />
                  <ColorScopePicker
                    value={rule.scope}
                    onChange={(scope) => updateRule(rule.id, { scope })}
                  />
                  <Select value={rule.fieldId} onValueChange={(fieldId) => {
                    const nextField = draftFields.find((item) => item.fieldId === fieldId)
                    updateRule(rule.id, { fieldId, operator: nextField?.type === 'number' ? 'greaterThan' : 'equals', value: nextField?.type === 'number' ? 0 : '' })
                  }}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>{fields.map((item) => <FieldSelectItem key={item.fieldId} fieldId={item.fieldId} label={item.label} type={item.type} />)}</SelectContent>
                  </Select>
                  {rule.scope === 'column' ? (
                    <div className="flex h-9 min-w-44 flex-1 items-center rounded-md border border-dashed px-3 text-xs text-muted-foreground">
                      {t('aiTable.color.columnHint')}
                    </div>
                  ) : (
                    <>
                      <Select value={rule.operator} onValueChange={(operator) => updateRule(rule.id, { operator: operator as AITableColorRule['operator'] })}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>{operators.map((operator) => <SelectItem key={operator.value} value={operator.value}>{operator.label}</SelectItem>)}</SelectContent>
                      </Select>
                      <AITableValueEditor
                        className="min-w-20 flex-1"
                        field={field}
                        operator={rule.operator}
                        value={rule.value}
                        onChange={(value) => updateRule(rule.id, { value })}
                      />
                    </>
                  )}
                  <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label={t('aiTable.color.deleteRule', { index: index + 1 })} onClick={() => updateDraft({ colorRules: rules.filter((item) => item.id !== rule.id) })}><Trash2 className="size-4" /></Button>
                </div>
              )
            })}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-3 gap-1" onClick={addRule}><Plus className="size-4" />{t('aiTable.color.addRule')}</Button>
        </div>
      </div>
      <PanelFooter primaryLabel={t('aiTable.color.apply')} />
    </div>
  )
}
