/**
 * ColumnSettingsDrawer — 列设置抽屉
 *
 * 基于 vaul Sheet（右侧抽屉），提供：
 * - 列显示/隐藏（含"必选"保护）
 * - 列顺序拖拽（@dnd-kit/sortable，实时重排 + 浮动副本）
 * - 表格行高切换（紧凑/中等/宽松）
 * - 恢复默认
 *
 * 颜色合规：所有颜色通过 CSS token 引用（对照 DESIGN.md）。
 */
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '../../i18n'
import { Check, GripVertical, Pin, RotateCcw } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '../ui/sheet'
import {
  type WmsColumnField,
  type WmsColumnSettingsState,
  type WmsTableDensity,
  normalizeState,
} from '../../hooks/useColumnSettings'

// ─── 密度选项 ──────────────────────────────────────────────

const densityOptions: Array<{ tKey: string; tDefault: string; value: WmsTableDensity }> = [
  { tKey: 'wms.columnSettings.density.compact', tDefault: '紧凑', value: 'compact' },
  { tKey: 'wms.columnSettings.density.medium', tDefault: '中等', value: 'medium' },
  { tKey: 'wms.columnSettings.density.relaxed', tDefault: '宽松', value: 'relaxed' },
]

// ─── 可拖拽列表项 ─────────────────────────────────────────

function SortableFieldItem({
  field,
  index,
}: {
  field: WmsColumnField
  index: number
}) {
  const { t } = useTranslation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: !!field.pinned })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5',
        field.pinned ? 'cursor-default' : 'cursor-grab',
        isDragging && 'opacity-30',
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...(field.pinned ? {} : listeners)}
    >
      {field.pinned ? (
        <Pin className="size-4 shrink-0 text-primary" />
      ) : (
        <GripVertical className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span className="w-5 text-right text-xs text-muted-foreground">
        {index + 1}
      </span>
      <span className="flex-1 truncate text-sm text-foreground">
        {field.label}
      </span>
      {field.pinned && (
        <span className="text-xs text-muted-foreground">{t('wms.columnSettings.pinned', '固定')}</span>
      )}
    </div>
  )
}

// ─── Props ───────────────────────────────────────────────

interface ColumnSettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: WmsColumnField[]
  state: WmsColumnSettingsState
  defaultState: WmsColumnSettingsState
  onApply: (state: WmsColumnSettingsState) => void
}

// ─── 组件 ─────────────────────────────────────────────────

export function ColumnSettingsDrawer({
  open,
  onOpenChange,
  fields,
  state,
  defaultState,
  onApply,
}: ColumnSettingsDrawerProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<WmsColumnSettingsState>(state)
  const [activeId, setActiveId] = useState<string | null>(null)

  // dnd-kit 传感器：鼠标移动 5px 后才触发拖拽，避免误触
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  // 打开时同步 draft
  useEffect(() => {
    if (open) {
      setDraft(state)
      setActiveId(null)
    }
  }, [open, state])

  // 归一化 draft（确保 required 字段不被移除、新增字段自动追加）
  const normalizedDraft = useMemo(
    () => normalizeState(draft, fields, draft.density),
    [draft, fields],
  )

  // 按 group 分组
  const groupedFields = useMemo(() => {
    const groups = new Map<string, WmsColumnField[]>()
    for (const field of fields) {
      const groupName = field.group ?? t('wms.columnSettings.groupOther', '其他')
      const bucket = groups.get(groupName) ?? []
      bucket.push(field)
      groups.set(groupName, bucket)
    }
    return Array.from(groups.entries()).map(([group, items]) => ({
      group,
      items,
    }))
  }, [fields, t])

  const fieldMap = useMemo(
    () => new Map(fields.map((f) => [f.id, f])),
    [fields],
  )

  const visibleSet = new Set(normalizedDraft.visible)
  const selectedOrder = normalizedDraft.order.filter((id) =>
    visibleSet.has(id),
  )

  // ── 操作函数 ──

  function updateDraft(next: WmsColumnSettingsState) {
    setDraft(normalizeState(next, fields, next.density))
  }

  function updateVisible(fieldId: string, checked: boolean) {
    updateDraft({
      ...normalizedDraft,
      visible: checked
        ? [...normalizedDraft.visible, fieldId]
        : normalizedDraft.visible.filter((id) => id !== fieldId),
    })
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    // pinned 字段不参与拖拽排序
    if (fieldMap.get(active.id as string)?.pinned) return
    if (fieldMap.get(over.id as string)?.pinned) return

    const oldIndex = normalizedDraft.order.indexOf(active.id as string)
    const newIndex = normalizedDraft.order.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    updateDraft({
      ...normalizedDraft,
      order: arrayMove(normalizedDraft.order, oldIndex, newIndex),
    })
  }

  function restoreDefault() {
    setDraft(defaultState)
  }

  function handleSave() {
    onApply(normalizedDraft)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} direction="right">
      <SheetContent size="xl" className="flex flex-col gap-0 bg-card p-0">
        {/* ── Header ── */}
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-6 py-4">
          <SheetTitle className="text-base">{t('wms.columnSettings.title', '列设置')}</SheetTitle>
        </SheetHeader>

        {/* ── 密度控制行 ── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-muted/30 px-6 py-3">
          <span className="text-xs text-muted-foreground">{t('wms.columnSettings.rowHeight', '表格行高')}</span>
          <div className="flex items-center gap-0.5">
            {densityOptions.map((opt) => {
              const active = normalizedDraft.density === opt.value
              return (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={active ? 'default' : 'outline'}
                  className="h-7 px-3 text-xs"
                  onClick={() =>
                    updateDraft({ ...normalizedDraft, density: opt.value })
                  }
                >
                  {t(opt.tKey, opt.tDefault)}
                </Button>
              )
            })}
          </div>
        </div>

        {/* ── 主体区 ── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* 左面板：字段选择 */}
          <div className="flex-1 overflow-y-auto border-r border-border px-6 py-4">
            {groupedFields.map((group) => {
              const optionalIds = group.items
                .filter((f) => !f.required)
                .map((f) => f.id)
              const allSelected =
                optionalIds.length > 0 &&
                optionalIds.every((id) => visibleSet.has(id))

              return (
                <section key={group.group} className="mb-5 last:mb-0">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-muted-foreground/30" />
                    <span className="text-sm font-medium text-foreground">
                      {group.group}
                    </span>
                    {optionalIds.length > 0 && (
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          const nextVisible = new Set(normalizedDraft.visible)
                          optionalIds.forEach((id) => {
                            if (allSelected) nextVisible.delete(id)
                            else nextVisible.add(id)
                          })
                          updateDraft({
                            ...normalizedDraft,
                            visible: Array.from(nextVisible),
                          })
                        }}
                      >
                        {allSelected ? t('wms.columnSettings.unselectAll', '取消全选') : t('wms.columnSettings.selectAll', '全选')}
                      </button>
                    )}
                  </div>
                  <div className="grid gap-2 lg:grid-cols-2">
                    {group.items.map((field) => {
                      const checked = visibleSet.has(field.id)
                      return (
                        <label
                          key={field.id}
                          className={cn(
                            'flex items-center gap-2 rounded-md border p-2',
                            checked
                              ? 'border-primary/30 bg-primary/5'
                              : 'border-border bg-background',
                            field.required ? 'cursor-default' : 'cursor-pointer',
                          )}
                        >
                          <Checkbox
                            checked={checked}
                            disabled={field.required}
                            onCheckedChange={(v) =>
                              updateVisible(field.id, !!v)
                            }
                          />
                          <span className="flex-1 truncate text-sm text-foreground">
                            {field.label}
                          </span>
                          {field.required && (
                            <span className="text-xs text-muted-foreground">
                              {t('wms.columnSettings.required', '必选')}
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          {/* 右面板：顺序预览（@dnd-kit 实时拖拽） */}
          <div className="flex w-52 shrink-0 flex-col border-l border-border">
            <div className="border-b border-border px-4 py-3">
              <span className="text-xs font-medium text-foreground">
                {t('wms.columnSettings.selected', '已选')} ({selectedOrder.length})
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t('wms.columnSettings.dragHint', '拖拽调整列顺序')}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedOrder.map((fieldId, index) => {
                    const field = fieldMap.get(fieldId)
                    if (!field) return null
                    return (
                      <SortableFieldItem
                        key={fieldId}
                        field={field}
                        index={index}
                      />
                    )
                  })}
                </SortableContext>
                {/* 浮动副本：拖拽时跟随鼠标，带阴影和边框 */}
                <DragOverlay dropAnimation={null}>
                  {activeId ? (
                    <div className="flex cursor-grabbing items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 shadow-md">
                      <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                      <span className="w-5 text-right text-xs text-muted-foreground">
                        {selectedOrder.indexOf(activeId) + 1}
                      </span>
                      <span className="flex-1 truncate text-sm text-foreground">
                        {fieldMap.get(activeId)?.label}
                      </span>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <SheetFooter className="flex-row items-center justify-between gap-2 border-t border-border p-4">
          <Button variant="outline" size="sm" onClick={restoreDefault}>
            <RotateCcw className="size-3.5" />
            {t('wms.columnSettings.restoreDefault', '恢复默认')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              {t('wms.columnSettings.cancel', '取消')}
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="size-3.5" />
              {t('wms.columnSettings.save', '保存')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
