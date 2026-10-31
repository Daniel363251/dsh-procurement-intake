import * as React from 'react'
import { useTranslation } from '../../i18n'
import { Copy, Loader2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '../ui/button'
import { AIPromptInput, PanelFooter, PanelHeader } from './AITablePanelParts'
import { AITableConditionBuilder } from './AITableConditionBuilder'
import { useAITable } from './AITableProvider'

export function AIFilterPanel() {
  const { t } = useTranslation()
  const { config, draftFields, queryFieldIds, state, updateDraft, setGenerationState } = useAITable()
  const filters = state.draftView.filters
  const fields = draftFields.filter((field) => field.filterable && (!queryFieldIds || queryFieldIds.includes(field.fieldId)))
  const [instruction, setInstruction] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const generating = state.generationState === 'generating'

  async function generate() {
    if (!instruction.trim() || generating) return
    setGenerationState('generating')
    setMessage(null)
    try {
      const rules = await config.aiAdapter.generateFilters({ instruction, fields })
      if (rules.length) {
        updateDraft({ filters: [...filters, ...rules] })
        setMessage(t('aiTable.filter.generated', { instruction }))
      } else {
        setMessage(t('aiTable.filter.noConditions'))
      }
      setGenerationState('success')
    } catch (error) {
      const detail = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
      setMessage(detail || t('aiTable.filter.generateFailed'))
      setGenerationState('error')
    }
  }

  return (
    <div className="bg-popover">
      <PanelHeader title={t('aiTable.filter.title')} />
      <div className="space-y-4 p-4">
        <AIPromptInput
          value={instruction}
          onChange={setInstruction}
          onSubmit={generate}
          loading={generating}
          placeholder={t('aiTable.filter.placeholder')}
        />

        {generating ? (
          <div className="flex items-center gap-2 text-xs text-primary">
            <Loader2 className="size-3.5 animate-spin" />
            {t('aiTable.filter.generating', { instruction })}
          </div>
        ) : message ? (
          <div className="flex items-center justify-between text-xs text-description">
            <span>{message}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label={t('aiTable.filter.feedbackHelpful')}><ThumbsUp className="size-3.5" /></Button>
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label={t('aiTable.filter.feedbackUnhelpful')}><ThumbsDown className="size-3.5" /></Button>
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label={t('aiTable.filter.copyInstruction')}><Copy className="size-3.5" /></Button>
            </div>
          </div>
        ) : null}

        <AITableConditionBuilder fields={fields} value={filters} onChange={(nextFilters) => updateDraft({ filters: nextFilters })} />
      </div>
      <PanelFooter />
    </div>
  )
}
