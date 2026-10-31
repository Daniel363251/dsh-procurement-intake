import type { ReactNode } from 'react'
import { useTranslation } from '../../i18n'
import { HelpCircle } from 'lucide-react'
import aiPromptIconUrl from '../../assets/ai-prompt-rabbit.png?inline'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'
import { useAITable } from './AITableProvider'

export function PanelHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {title}
        <HelpCircle className="size-3.5 text-muted-foreground" />
      </div>
      {actions}
    </div>
  )
}

export function AIPromptInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  loading,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder: string
  loading?: boolean
  disabled?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg border bg-card px-2 shadow-sm transition-colors',
      loading && 'bg-muted/30',
    )}>
      <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md">
        <img src={aiPromptIconUrl} alt="" aria-hidden="true" className="size-full object-cover" />
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) onSubmit()
        }}
        placeholder={placeholder}
        disabled={loading || disabled}
        className="h-10 flex-1 border-0 px-0 text-sm shadow-none focus:!shadow-none focus-visible:!shadow-none focus-visible:!ring-0"
      />
      {value ? (
        <Button
          type="button"
          size="sm"
          className="h-7 px-3 text-xs"
          disabled={loading || disabled}
          onClick={onSubmit}
        >
          {loading ? t('aiTable.panelParts.generating') : t('aiTable.panelParts.generate')}
        </Button>
      ) : null}
    </div>
  )
}

export function PanelFooter({ primaryLabel }: { primaryLabel?: string }) {
  const { t } = useTranslation()
  const { saveView, cancelDraft } = useAITable()
  return (
    <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
      <Button type="button" variant="outline" size="sm" onClick={cancelDraft}>{t('aiTable.panelParts.cancel')}</Button>
      <Button type="button" size="sm" onClick={saveView}>{primaryLabel ?? t('aiTable.panelParts.save')}</Button>
    </div>
  )
}
