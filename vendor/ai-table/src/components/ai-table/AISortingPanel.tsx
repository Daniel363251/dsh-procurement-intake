import * as React from 'react'
import { useTranslation } from '../../i18n'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import { FieldSelectItem } from './FieldTypeIcon'
import { cn } from '../../lib/utils'
import { PanelFooter, PanelHeader } from './AITablePanelParts'
import { useAITable } from './AITableProvider'
import type { AITableSortRule } from './types'

export function AISortingPanel() {
  const { t } = useTranslation()
  const { draftFields, queryFieldIds, state, updateDraft } = useAITable()
  const sorts = state.draftView.sorts
  const fields = draftFields.filter((field) => field.sortable && (!queryFieldIds || queryFieldIds.includes(field.fieldId)))
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)

  function addSort() {
    const used = new Set(sorts.map((sort) => sort.fieldId))
    const field = fields.find((item) => !used.has(item.fieldId))
    if (!field) return
    updateDraft({ sorts: [...sorts, { fieldId: field.fieldId, direction: 'asc' }] })
  }

  function updateSort(index: number, patch: Partial<AITableSortRule>) {
    updateDraft({
      sorts: sorts.map((sort, itemIndex) => itemIndex === index ? { ...sort, ...patch } : sort),
    })
  }

  function reorder(toIndex: number) {
    if (draggedIndex == null || draggedIndex === toIndex) return
    const next = [...sorts]
    const [moved] = next.splice(draggedIndex, 1)
    next.splice(toIndex, 0, moved)
    updateDraft({ sorts: next })
    setDraggedIndex(toIndex)
  }

  const usedFieldIds = new Set(sorts.map((sort) => sort.fieldId))
  const canAdd = fields.some((field) => !usedFieldIds.has(field.fieldId))

  return (
    <div className="bg-popover">
      <PanelHeader title={t('aiTable.sort.title')} />
      <div className="space-y-2 p-4">
        {sorts.map((sort, index) => (
          <div
            key={`${sort.fieldId}-${index}`}
            className="flex items-center gap-2"
            onDragOver={(event) => { event.preventDefault(); reorder(index) }}
          >
            <button
              type="button"
              draggable
              className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
              aria-label={t('aiTable.sort.dragHint', { index: index + 1 })}
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
            >
              <GripVertical className="size-4" />
            </button>
            <Select value={sort.fieldId} onValueChange={(fieldId) => updateSort(index, { fieldId })}>
              <SelectTrigger className="min-w-0 flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <FieldSelectItem
                    key={field.fieldId}
                    fieldId={field.fieldId}
                    label={field.label}
                    type={field.type}
                    disabled={field.fieldId !== sort.fieldId && usedFieldIds.has(field.fieldId)}
                  />
                ))}
              </SelectContent>
            </Select>
            <div className="flex shrink-0 rounded-lg bg-muted p-1">
              <DirectionButton
                active={sort.direction === 'asc'}
                label="A → Z"
                ariaLabel={t('aiTable.sort.asc', { index: index + 1 })}
                onClick={() => updateSort(index, { direction: 'asc' })}
              />
              <DirectionButton
                active={sort.direction === 'desc'}
                label="Z → A"
                ariaLabel={t('aiTable.sort.desc', { index: index + 1 })}
                onClick={() => updateSort(index, { direction: 'desc' })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground"
              aria-label={t('aiTable.sort.deleteSort', { index: index + 1 })}
              onClick={() => updateDraft({ sorts: sorts.filter((_, itemIndex) => itemIndex !== index) })}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}

        {canAdd ? (
          <Button type="button" variant="outline" size="sm" className="mt-2 gap-1" onClick={addSort}>
            <Plus className="size-4" />{t('aiTable.sort.addSort')}
          </Button>
        ) : null}
        {!sorts.length ? (
          <p className="py-4 text-center text-xs text-muted-foreground">{t('aiTable.sort.emptyHint')}</p>
        ) : null}
      </div>
      <PanelFooter primaryLabel={t('aiTable.sort.apply')} />
    </div>
  )
}

function DirectionButton({
  active,
  label,
  ariaLabel,
  onClick,
}: {
  active: boolean
  label: string
  ariaLabel: string
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        'h-8 min-w-20 px-3 text-sm',
        active ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground',
      )}
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
