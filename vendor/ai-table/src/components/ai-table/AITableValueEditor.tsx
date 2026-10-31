import { useTranslation } from '../../i18n'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import type { AITableField, AITableFilterOperator } from './types'

type AITableValueField = Pick<AITableField<unknown>, 'type' | 'options'>

interface AITableValueEditorProps {
  field?: AITableValueField
  operator: AITableFilterOperator
  value: unknown
  onChange: (value: unknown) => void
  className?: string
}

/**
 * 规则值的统一编辑器。
 * 业务页面只声明字段类型与枚举选项，筛选、填色等能力共享同一套输入控件。
 */
export function AITableValueEditor({ field, operator, value, onChange, className }: AITableValueEditorProps) {
  const { t } = useTranslation()
  if (!field || ['isEmpty', 'notEmpty', 'isToday', 'isPast', 'isFuture'].includes(operator)) return <div className={className} />

  if (field.options?.length) {
    const selectedValue = field.options.some((option) => String(option.value) === String(value))
      ? String(value)
      : undefined
    return (
      <Select
        value={selectedValue}
        onValueChange={(nextValue) => {
          const option = field.options?.find((item) => String(item.value) === nextValue)
          onChange(option?.value ?? nextValue)
        }}
      >
        <SelectTrigger className={className}><SelectValue placeholder={t('aiTable.valueEditor.selectPlaceholder')} /></SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (operator === 'withinPastDays' || operator === 'withinNextDays') {
    return (
      <Input
        className={className}
        type="number"
        inputMode="decimal"
        min={0}
        placeholder="7"
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
      />
    )
  }

  if (operator === 'between') {
    const range = Array.isArray(value) ? value : ['', '']
    const inputType = field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : 'date'
    return (
      <div className={`flex min-w-0 items-center gap-1.5 ${className ?? ''}`}>
        <Input
          className="min-w-0 flex-1"
          type={inputType}
          value={String(range[0] ?? '')}
          onChange={(event) => onChange([normalizeValue(field.type, event.target.value), range[1] ?? ''])}
          aria-label={t('aiTable.valueEditor.rangeStart')}
        />
        <span className="shrink-0 text-xs text-muted-foreground">{t('aiTable.valueEditor.rangeTo')}</span>
        <Input
          className="min-w-0 flex-1"
          type={inputType}
          value={String(range[1] ?? '')}
          onChange={(event) => onChange([range[0] ?? '', normalizeValue(field.type, event.target.value)])}
          aria-label={t('aiTable.valueEditor.rangeEnd')}
        />
      </div>
    )
  }

  const inputType = field.type === 'number'
    ? 'number'
    : field.type === 'date'
      ? 'date'
      : field.type === 'datetime'
        ? 'datetime-local'
        : 'text'

  return (
    <Input
      className={className}
      type={inputType}
      inputMode={field.type === 'number' ? 'decimal' : undefined}
      placeholder={field.type === 'text' || field.type === 'tag' ? t('aiTable.valueEditor.inputPlaceholder') : undefined}
      value={String(value ?? '')}
      onChange={(event) => onChange(normalizeValue(field.type, event.target.value))}
    />
  )
}

function normalizeValue(type: AITableValueField['type'], value: string) {
  if (type !== 'number') return value
  return value === '' ? '' : Number(value)
}
