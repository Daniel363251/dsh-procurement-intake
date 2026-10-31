import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../i18n'
import { Button } from '../ui/button'
import { useAITable } from './AITableProvider'
import type { AITableActivePanel } from './types'

const PANEL_LABEL_KEYS: Record<Exclude<AITableActivePanel, null>, string> = {
  filter: 'aiTable.draftBar.filter',
  group: 'aiTable.draftBar.group',
  sort: 'aiTable.draftBar.sort',
  color: 'aiTable.draftBar.color',
  aiField: 'aiTable.draftBar.aiField',
}

export function AITableDraftBar() {
  const { t } = useTranslation()
  const { state, saveView, cancelDraft } = useAITable()
  if (!state.dirty) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-description">
        <CheckCircle2 className="size-4 text-status-approved" />
        {t('aiTable.draftBar.viewSaved')}
      </div>
    )
  }

  const label = state.activePanel ? t(PANEL_LABEL_KEYS[state.activePanel]) : t('aiTable.draftBar.view')
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary/6 pl-3 text-xs text-description">
      <span>{t('aiTable.draftBar.adjustedConfig', { label })}</span>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary" onClick={cancelDraft}>
        {t('aiTable.draftBar.cancel')}
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary" onClick={saveView}>
        {t('aiTable.draftBar.save')}
      </Button>
    </div>
  )
}
