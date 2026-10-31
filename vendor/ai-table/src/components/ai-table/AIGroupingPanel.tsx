import * as React from 'react'
import { useTranslation } from '../../i18n'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import { FieldSelectItem } from './FieldTypeIcon'
import { PanelFooter, PanelHeader } from './AITablePanelParts'
import { useAITable } from './AITableProvider'
import { applyFilters, applyGrouping } from './ai-table-engine'
import type { AITableGroup, AITableGroupRule } from './types'

const MAX_GROUPS = 2

export function AIGroupingPanel() {
  const { t } = useTranslation()
  const { draftFields, rows, state, updateDraft } = useAITable()
  const groups = state.draftView.groups
  const fields = draftFields.filter((field) => field.groupable)
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)

  function addGroup() {
    if (groups.length >= MAX_GROUPS) return
    const used = new Set(groups.map((group) => group.fieldId))
    const field = fields.find((item) => !used.has(item.fieldId) && item.source === 'ai')
      ?? fields.find((item) => !used.has(item.fieldId) && item.type === 'tag')
      ?? fields.find((item) => !used.has(item.fieldId))
    if (!field) return
    updateDraft({ groups: [...groups, { fieldId: field.fieldId, direction: 'asc' }] })
  }

  function updateGroup(index: number, patch: Partial<AITableGroupRule>) {
    updateDraft({ groups: groups.map((group, itemIndex) => itemIndex === index ? { ...group, ...patch } : group) })
  }

  function reorder(toIndex: number) {
    if (draggedIndex == null || draggedIndex === toIndex) return
    const next = [...groups]
    const [moved] = next.splice(draggedIndex, 1)
    next.splice(toIndex, 0, moved)
    updateDraft({ groups: next })
    setDraggedIndex(toIndex)
  }

  function collapseAll() {
    const filtered = applyFilters(rows, state.savedView.filters, draftFields)
    const previewGroups = applyGrouping(filtered, groups, draftFields, [])
    updateDraft({ collapsedGroupKeys: collectGroupKeys(previewGroups) })
  }

  return (
    <div className="bg-popover">
      <PanelHeader
        title={t('aiTable.group.title')}
        actions={groups.length ? (
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={collapseAll}>{t('aiTable.group.collapseAll')}</Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => updateDraft({ collapsedGroupKeys: [] })}>{t('aiTable.group.expandAll')}</Button>
          </div>
        ) : null}
      />
      <div className="space-y-2 p-4">
        {groups.map((group, index) => (
          <div
            key={`${group.fieldId}-${index}`}
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => { event.preventDefault(); reorder(index) }}
            onDragEnd={() => setDraggedIndex(null)}
            className="flex items-center gap-2"
          >
            <GripVertical className="size-4 cursor-grab text-muted-foreground" />
            <Select value={group.fieldId} onValueChange={(fieldId) => updateGroup(index, { fieldId })}>
              <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>{fields.map((field) => <FieldSelectItem key={field.fieldId} fieldId={field.fieldId} label={field.label} type={field.type} />)}</SelectContent>
            </Select>
            <div className="flex rounded-md bg-muted p-0.5">
              <Button type="button" variant="ghost" size="sm" className={group.direction === 'asc' ? 'h-8 bg-card px-3 text-xs text-primary shadow-sm' : 'h-8 px-3 text-xs text-muted-foreground'} onClick={() => updateGroup(index, { direction: 'asc' })}>{t('aiTable.group.optionOrder')}</Button>
              <Button type="button" variant="ghost" size="sm" className={group.direction === 'desc' ? 'h-8 bg-card px-3 text-xs text-primary shadow-sm' : 'h-8 px-3 text-xs text-muted-foreground'} onClick={() => updateGroup(index, { direction: 'desc' })}>{t('aiTable.group.optionReverse')}</Button>
            </div>
            <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label={t('aiTable.group.deleteGroup', { index: index + 1 })} onClick={() => updateDraft({ groups: groups.filter((_, itemIndex) => itemIndex !== index) })}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {groups.length < MAX_GROUPS ? (
          <Button type="button" variant="outline" size="sm" className="mt-2 gap-1" onClick={addGroup}><Plus className="size-4" />{t('aiTable.group.addGroup')}</Button>
        ) : null}
        {!groups.length ? <p className="py-4 text-center text-xs text-muted-foreground">{t('aiTable.group.emptyHint')}</p> : null}
      </div>
      <PanelFooter primaryLabel={t('aiTable.group.apply')} />
    </div>
  )
}

function collectGroupKeys<TRow>(groups: AITableGroup<TRow>[]): string[] {
  return groups.flatMap((group) => [group.key, ...(group.children ? collectGroupKeys(group.children) : [])])
}
