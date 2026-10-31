import { Calendar, Hash, Tag, Type, Clock } from 'lucide-react'
import { SelectItem } from '../ui/select'
import { cn } from '../../lib/utils'
import type { AITableFieldType } from './types'

const FIELD_TYPE_CONFIG: Record<AITableFieldType, { icon: typeof Type; label: string; color: string }> = {
  text:     { icon: Type,     label: 'Text',     color: 'text-muted-foreground' },
  number:   { icon: Hash,     label: 'Number',   color: 'text-blue-500' },
  tag:      { icon: Tag,      label: 'Tag',      color: 'text-purple-500' },
  date:     { icon: Calendar,  label: 'Date',     color: 'text-green-500' },
  datetime: { icon: Clock,     label: 'DateTime', color: 'text-green-500' },
}

export function FieldTypeIcon({
  type,
  className,
  showLabel = false,
}: {
  type: AITableFieldType
  className?: string
  showLabel?: boolean
}) {
  const config = FIELD_TYPE_CONFIG[type]
  const Icon = config.icon
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Icon className={cn('size-3.5 shrink-0', config.color)} />
      {showLabel && (
        <span className={cn('text-[10px] font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </span>
  )
}

export function FieldSelectItem({
  fieldId,
  label,
  type,
  disabled,
}: {
  fieldId: string
  label: string
  type: AITableFieldType
  disabled?: boolean
}) {
  return (
    <SelectItem
      key={fieldId}
      value={fieldId}
      disabled={disabled}
    >
      <span className="flex items-center gap-2">
        <FieldTypeIcon type={type} />
        <span>{label}</span>
      </span>
    </SelectItem>
  )
}

// Re-export SelectItem for convenience
export { SelectItem } from '../ui/select'
