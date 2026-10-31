import * as React from 'react'
import { useTranslation } from '../../i18n'
import { Check, ChevronDown, Hash, List, UserRound } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { COLOR_PALETTE_ROWS, getColorOption } from './color-palette'
import type { AITableColorScope, AITableColorToken } from './types'

interface ColorPalettePickerProps {
  value: AITableColorToken
  onChange: (value: AITableColorToken) => void
}

export function ColorPalettePicker({ value, onChange }: ColorPalettePickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const selected = getColorOption(value)
  useDismissOnOutsidePointer(rootRef, open, () => setOpen(false))

  return (
    <div ref={rootRef} className="relative shrink-0">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        aria-label={t('aiTable.color.selectColor', { label: selected.label })}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className="size-5 rounded-md border border-black/8"
          style={{ backgroundColor: selected.backgroundColor }}
        />
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-label={t('aiTable.color.backgroundFill')}
          className="absolute left-0 top-full z-70 mt-2 w-[380px] rounded-xl border bg-popover p-4 shadow-xl"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false)
          }}
        >
          <p className="mb-3 text-sm font-semibold">{t('aiTable.color.backgroundFill')}</p>
          <div className="space-y-2">
            {COLOR_PALETTE_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-11 gap-2">
                {row.map((option) => {
                  const active = getColorOption(value).value === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-label={option.label}
                      aria-pressed={active}
                      className={cn(
                        'relative size-7 rounded-md border border-black/5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        active && 'ring-2 ring-primary ring-offset-2',
                      )}
                      style={{ backgroundColor: option.backgroundColor }}
                      onClick={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                    >
                      {active ? <Check className="absolute inset-0 m-auto size-3.5" style={{ color: option.foregroundColor }} /> : null}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface ColorScopePickerProps {
  value: AITableColorScope
  onChange: (value: AITableColorScope) => void
}

const SCOPE_KEYS: Array<{
  value: AITableColorScope
  labelKey: string
  titleKey: string
  descKey: string
}> = [
  {
    value: 'cell',
    labelKey: 'aiTable.colorScope.cell',
    titleKey: 'aiTable.colorScope.cellTitle',
    descKey: 'aiTable.colorScope.cellDesc',
  },
  {
    value: 'row',
    labelKey: 'aiTable.colorScope.row',
    titleKey: 'aiTable.colorScope.rowTitle',
    descKey: 'aiTable.colorScope.rowDesc',
  },
  {
    value: 'rowMarker',
    labelKey: 'aiTable.colorScope.rowMarker',
    titleKey: 'aiTable.colorScope.rowMarkerTitle',
    descKey: 'aiTable.colorScope.rowMarkerDesc',
  },
  {
    value: 'column',
    labelKey: 'aiTable.colorScope.column',
    titleKey: 'aiTable.colorScope.columnTitle',
    descKey: 'aiTable.colorScope.columnDesc',
  },
]

export function ColorScopePicker({ value, onChange }: ColorScopePickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [previewScope, setPreviewScope] = React.useState<AITableColorScope>(value)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const selected = SCOPE_KEYS.find((option) => option.value === value) ?? SCOPE_KEYS[0]
  const preview = SCOPE_KEYS.find((option) => option.value === previewScope) ?? selected
  useDismissOnOutsidePointer(rootRef, open, () => setOpen(false))
  const selectedLabel = t(selected.labelKey)
  const previewTitle = t(preview.titleKey)
  const previewDesc = t(preview.descKey)

  return (
    <div ref={rootRef} className="relative shrink-0">
      <Button
        type="button"
        variant="outline"
        className="h-9 w-24 justify-between px-3 font-normal"
        aria-label={t('aiTable.color.selectScope', { label: selectedLabel })}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setPreviewScope(value)
          setOpen((current) => !current)
        }}
      >
        {selectedLabel}
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>
      {open ? (
        <div className="absolute left-0 top-full z-60 mt-2 flex w-[560px] items-start gap-2">
          <div role="menu" aria-label={t('aiTable.color.scopeMenu')} className="w-36 rounded-xl border bg-popover p-1.5 shadow-xl">
            {SCOPE_KEYS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={option.value === value}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm outline-none hover:bg-muted focus:bg-muted',
                  option.value === previewScope && 'bg-muted',
                  option.value === value && 'bg-primary/8',
                )}
                onPointerEnter={() => setPreviewScope(option.value)}
                onFocus={() => setPreviewScope(option.value)}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                {t(option.labelKey)}
                {option.value === value ? <Check className="size-4 text-primary" /> : null}
              </button>
            ))}
          </div>
          <div className="w-[416px] rounded-xl bg-[#484a58] p-4 text-white shadow-xl">
            <p className="text-base font-semibold">{previewTitle}</p>
            <p className="mt-1 text-sm leading-5 text-white/65">{previewDesc}</p>
            <ScopePreview scope={preview.value} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ScopePreview({ scope }: { scope: AITableColorScope }) {
  const { t } = useTranslation()
  const rows = [
    ['客户演示准备', 'P0', '进行中'],
    ['广告投放策略', 'P1', '进行中'],
    ['满意度调查', 'P1', '已完成'],
    ['最终测试', 'P0', '已完成'],
  ]
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-white/25 bg-card text-foreground">
      <table className="w-full table-fixed text-[10px]">
        <thead>
          <tr className="border-b bg-muted/70 text-muted-foreground">
            <th className="w-1/2 px-2 py-1.5 text-left font-medium"><span className="flex items-center gap-1"><List className="size-3" />{t('aiTable.colorScope.previewTask')}</span></th>
            <th className={cn('px-2 py-1.5 text-left font-medium', scope === 'column' && 'bg-purple-100')}><span className="flex items-center gap-1"><Hash className="size-3" />{t('aiTable.colorScope.previewPriority')}</span></th>
            <th className="px-2 py-1.5 text-left font-medium"><span className="flex items-center gap-1"><UserRound className="size-3" />{t('aiTable.colorScope.previewStatus')}</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0]} className={cn('border-b last:border-b-0', scope === 'row' && (index === 0 || index === 3) && 'bg-red-50')}>
              <td className="relative truncate px-2 py-1.5">
                {scope === 'rowMarker' ? <span className={cn('absolute inset-y-0 left-0 w-0.5', index % 2 ? 'bg-amber-400' : 'bg-primary')} /> : null}
                {row[0]}
              </td>
              <td className={cn('px-2 py-1.5', scope === 'cell' && (index === 1 || index === 3) && 'bg-red-100', scope === 'column' && 'bg-purple-100')}>{row[1]}</td>
              <td className="px-2 py-1.5">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function useDismissOnOutsidePointer(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: () => void,
) {
  React.useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onDismiss()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onDismiss, open, ref])
}
