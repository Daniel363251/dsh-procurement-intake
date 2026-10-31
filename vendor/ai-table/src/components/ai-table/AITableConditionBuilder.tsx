import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from '../../i18n'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FieldSelectItem } from './FieldTypeIcon'
import { AITableValueEditor } from './AITableValueEditor'
import { generateId } from './ai-table-engine'
import { getOperatorsByFieldType } from './types'
import type { AITableConjunction, AITableField, AITableFilterRule } from './types'

interface AITableConditionBuilderProps<TRow> {
  fields: AITableField<TRow>[]
  value: AITableFilterRule[]
  onChange: (rules: AITableFilterRule[]) => void
}

/**
 * 共享的条件编辑器：连续 AND 规则组成一个条件组，OR 从下一条规则开始一个新组。
 * AI Table 与业务筛选表单均通过此组件编辑，避免两套 UI 或布尔语义漂移。
 */
export function AITableConditionBuilder<TRow>({ fields, value, onChange }: AITableConditionBuilderProps<TRow>) {
  const { t } = useTranslation()
  const filterableFields = fields.filter((field) => field.filterable)

  function addCondition(conjunction: AITableConjunction = 'and') {
    const field = filterableFields.find((item) => item.type === 'tag') ?? filterableFields[0]
    if (!field) return
    onChange([...value, {
      id: generateId('filter'),
      fieldId: field.fieldId,
      operator: getOperatorsByFieldType(field.type)[0].value,
      value: '',
      conjunction: value.length ? conjunction : 'and',
    }])
  }

  function updateRule(id: string, patch: Partial<AITableFilterRule>) {
    onChange(value.map((rule) => rule.id === id ? { ...rule, ...patch } : rule))
  }

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">{t('aiTable.filter.conditionDescription')}</p>
      <div className="space-y-2">
        {value.map((rule, index) => {
          const field = fields.find((item) => item.fieldId === rule.fieldId)
          const operators = field ? getOperatorsByFieldType(field.type) : []
          return (
            <div key={rule.id} className="flex items-center gap-2">
              <GripVertical className="size-4 shrink-0 text-muted-foreground/60" />
              {index === 0 ? (
                <span className="w-12 shrink-0 text-sm font-medium">{t('aiTable.filter.when')}</span>
              ) : (
                <Select value={rule.conjunction} onValueChange={(nextValue) => updateRule(rule.id, { conjunction: nextValue as AITableConjunction })}>
                  <SelectTrigger className="w-[68px] shrink-0" onPointerDown={() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur() }}>
                    <SelectValue>{rule.conjunction === 'and' ? t('aiTable.filter.and') : t('aiTable.filter.or')}</SelectValue>
                  </SelectTrigger>
                  <SelectContent><SelectItem value="and">{t('aiTable.filter.and')}</SelectItem><SelectItem value="or">{t('aiTable.filter.or')}</SelectItem></SelectContent>
                </Select>
              )}
              <Select
                value={rule.fieldId}
                onValueChange={(fieldId) => {
                  const nextField = fields.find((item) => item.fieldId === fieldId)
                  updateRule(rule.id, { fieldId, operator: getOperatorsByFieldType(nextField?.type ?? 'text')[0].value, value: '' })
                }}
              >
                <SelectTrigger className="w-36 shrink-0" onPointerDown={() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur() }}><SelectValue /></SelectTrigger>
                <SelectContent>{filterableFields.map((item) => <FieldSelectItem key={item.fieldId} fieldId={item.fieldId} label={item.label} type={item.type} />)}</SelectContent>
              </Select>
              <Select value={rule.operator} onValueChange={(operator) => updateRule(rule.id, { operator: operator as AITableFilterRule['operator'] })}>
                <SelectTrigger className="w-28 shrink-0" onPointerDown={() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur() }}><SelectValue /></SelectTrigger>
                <SelectContent>{operators.map((operator) => <SelectItem key={operator.value} value={operator.value}>{operator.label}</SelectItem>)}</SelectContent>
              </Select>
              <AITableValueEditor className="min-w-0 flex-1" field={field} operator={rule.operator} value={rule.value} onChange={(nextValue) => updateRule(rule.id, { value: nextValue })} />
              <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground" aria-label={t('aiTable.filter.deleteCondition', { index: index + 1 })} onClick={() => onChange(value.filter((item) => item.id !== rule.id))}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" className="gap-1 px-2" onClick={() => addCondition('and')}><Plus className="size-4" />{t('aiTable.filter.addCondition')}</Button>
        <Button type="button" variant="ghost" size="sm" className="gap-1 px-2" onClick={() => addCondition('or')}><Plus className="size-4" />{t('aiTable.filter.addConditionGroup')}</Button>
      </div>
    </div>
  )
}
