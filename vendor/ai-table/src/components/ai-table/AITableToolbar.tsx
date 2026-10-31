import * as React from 'react'
import { useTranslation } from '../../i18n'
import { ArrowUpDown, Filter, LayoutList, Palette, Plus, RotateCcw, Settings2, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '../../lib/utils'
import { AIColorPanel } from './AIColorPanel'
import { AIFieldPanel } from './AIFieldPanel'
import { AIFilterPanel } from './AIFilterPanel'
import { AIGroupingPanel } from './AIGroupingPanel'
import { AISortingPanel } from './AISortingPanel'
import { useAITable } from './AITableProvider'
import { getColorSummary, getFilterSummary, getSortSummary } from './ai-table-engine'
import type { AITableActivePanel } from './types'

export interface AITableToolbarProps {
  /** Open the host column settings dialog; omit to hide the column settings button. */
  openColumnSettings?: () => void
  /** Selected row count reported by the host table; renders a badge when > 0. */
  selectedCount?: number
}

export function AITableToolbar({ openColumnSettings, selectedCount = 0 }: AITableToolbarProps) {
  const { t } = useTranslation()
  const { state, setActivePanel, appliedFields, restoreDefaultView } = useAITable()
  const { savedView } = state
  const groupedField = appliedFields.find((field) => field.fieldId === savedView.groups[0]?.fieldId)

  const items: Array<{
    panel: Exclude<AITableActivePanel, null>
    icon: React.ReactNode
    label: string
    summary?: string | null
    content: React.ReactNode
    width: string
  }> = [
    {
      panel: 'filter',
      icon: <Filter className="size-4" />,
      label: t('aiTable.toolbar.filter'),
      summary: getFilterSummary(savedView.filters),
      content: <AIFilterPanel />,
      width: 'w-[590px]',
    },
    {
      panel: 'group',
      icon: <LayoutList className="size-4" />,
      label: t('aiTable.toolbar.group'),
      summary: groupedField ? t('aiTable.toolbar.groupSummaryByField', { field: groupedField.label }) : null,
      content: <AIGroupingPanel />,
      width: 'w-[520px]',
    },
    {
      panel: 'sort',
      icon: <ArrowUpDown className="size-4" />,
      label: t('aiTable.toolbar.sort'),
      summary: getSortSummary(savedView.sorts, appliedFields),
      content: <AISortingPanel />,
      width: 'w-[620px]',
    },
    {
      panel: 'color',
      icon: <Palette className="size-4" />,
      label: t('aiTable.toolbar.color'),
      summary: getColorSummary(savedView.colorRules),
      content: <AIColorPanel />,
      width: 'w-[700px]',
    },
    {
      panel: 'aiField',
      icon: <Plus className="size-4" />,
      label: t('aiTable.toolbar.addField'),
      content: <AIFieldPanel />,
      width: 'w-[540px]',
    },
  ]

  return (
    <div className="flex min-w-0 items-center gap-1">
      {selectedCount > 0 ? (
        <span className="mr-2 whitespace-nowrap text-xs font-medium text-description">
          {t('wms.selectedCount', { count: selectedCount })}
        </span>
      ) : null}
      <div className="mr-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-description">
        <Sparkles className="size-4 text-primary" />
        {t('aiTable.toolbar.savedView')}
      </div>

      {items.map((item) => (
        <PanelButton key={item.panel} {...item} activePanel={state.activePanel} setActivePanel={setActivePanel} />
      ))}
      <Button
        type="button"
        aria-label={t('aiTable.toolbar.restoreDefault', '恢复默认视图')}
        title={t('aiTable.toolbar.restoreDefault', '恢复默认视图')}
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 whitespace-nowrap px-3 text-xs text-description"
        onClick={restoreDefaultView}
      >
        <RotateCcw className="size-4" />
        {t('aiTable.toolbar.restoreDefault', '恢复默认视图')}
      </Button>
      {openColumnSettings ? (
        <Button
          type="button"
          aria-label={t('wms.columnSettings.title', '列设置')}
          title={t('wms.columnSettings.title', '列设置')}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 whitespace-nowrap px-3 text-xs text-description"
          onClick={openColumnSettings}
        >
          <Settings2 className="size-4" />
          {t('wms.columnSettings.title', '列设置')}
        </Button>
      ) : null}
    </div>
  )
}

function PanelButton({
  panel,
  icon,
  label,
  summary,
  content,
  width,
  activePanel,
  setActivePanel,
}: {
  panel: Exclude<AITableActivePanel, null>
  icon: React.ReactNode
  label: string
  summary?: string | null
  content: React.ReactNode
  width: string
  activePanel: AITableActivePanel
  setActivePanel: (panel: AITableActivePanel) => void
}) {
  const open = activePanel === panel
  return (
    <Popover open={open} onOpenChange={(next) => setActivePanel(next ? panel : null)}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          aria-label={label}
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 gap-1.5 whitespace-nowrap border border-transparent px-3 text-xs text-description',
            (open || summary) && 'border-primary/20 bg-primary/6 text-foreground',
          )}
        >
          <span className={cn(open && 'text-primary')}>{icon}</span>
          {summary ?? label}
          {panel === 'filter' && summary ? (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {Math.max(1, Number(summary.match(/\d+/)?.[0] ?? 1))}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        style={panel === 'aiField' ? { height: 'min(680px, var(--radix-popover-content-available-height))' } : undefined}
        className={cn(
          'max-h-[min(calc(100vh-32px),var(--radix-popover-content-available-height))] rounded-xl p-0 shadow-xl',
          panel === 'aiField'
            ? 'h-[min(680px,var(--radix-popover-content-available-height))] min-h-0 overflow-hidden'
            : panel === 'color'
              ? 'overflow-visible'
              : 'overflow-y-auto',
          width,
        )}
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}
