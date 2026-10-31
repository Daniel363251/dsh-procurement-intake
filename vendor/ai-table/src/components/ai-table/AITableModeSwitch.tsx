/**
 * AITableModeSwitch — 传统表格 / 智能表格切换
 *
 * 默认由 AppLayout 的全局列表页入口渲染。dirty 状态下切换弹出
 * AlertDialog 确认；保留本组件导出便于独立预览和测试。
 */

import * as React from 'react'
import { useTranslation } from '../../i18n'
import { LoaderCircle, Sparkles, Table2 } from 'lucide-react'
import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { useAITable } from './AITableProvider'
import { cn } from '../../lib/utils'
import type { AITableModeTransition } from './types'

export interface AITableModeSwitchControlProps {
  mode: 'classic' | 'smart'
  modeTransition: AITableModeTransition
  dirty: boolean
  setMode: (mode: 'classic' | 'smart') => void
  cancelDraft: () => void
}

export function AITableModeSwitchControl({
  mode,
  modeTransition,
  dirty,
  setMode,
  cancelDraft,
}: AITableModeSwitchControlProps) {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [pendingMode, setPendingMode] = React.useState<'classic' | 'smart' | null>(null)

  function handleClick(nextMode: 'classic' | 'smart') {
    if (nextMode === mode) return
    // dirty 时需要确认
    if (dirty && mode === 'smart' && nextMode === 'classic') {
      setPendingMode(nextMode)
      setConfirmOpen(true)
      return
    }
    setMode(nextMode)
  }

  function handleConfirmSwitch() {
    if (pendingMode) {
      cancelDraft()
      setMode(pendingMode)
    }
    setConfirmOpen(false)
    setPendingMode(null)
  }

  function handleCancelConfirm() {
    setConfirmOpen(false)
    setPendingMode(null)
  }

  const smart = mode === 'smart'
  const switchingToSmart = modeTransition === 'switching-to-smart'
  const nextMode = smart ? 'classic' : 'smart'

  return (
    <>
      <Button
        type="button"
        variant={smart ? 'default' : 'outline'}
        size="sm"
        className={cn(
          'h-8 gap-1.5 px-2.5 text-xs font-medium shadow-none xl:px-3',
          smart
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'border-primary/30 bg-primary/5 text-primary hover:border-primary/45 hover:bg-primary/10 hover:text-primary',
        )}
        aria-pressed={smart}
        aria-busy={switchingToSmart}
        aria-label={switchingToSmart ? t('aiTable.modeSwitch.switchingToSmart') : smart ? t('aiTable.modeSwitch.backToClassic') : t('aiTable.modeSwitch.switchToSmart')}
        disabled={switchingToSmart}
        onClick={() => handleClick(nextMode)}
      >
        {switchingToSmart
          ? <LoaderCircle className="size-3.5 animate-spin" />
          : smart
            ? <Table2 className="size-3.5" />
            : <Sparkles className="size-3.5" />}
        <span className="hidden xl:inline">
          {switchingToSmart ? t('aiTable.modeSwitch.switching') : smart ? t('aiTable.modeSwitch.backToClassic') : t('aiTable.modeSwitch.switchToSmart')}
        </span>
        <span className="xl:hidden">{t('aiTable.modeSwitch.aiTable')}</span>
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('aiTable.modeSwitch.discardTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('aiTable.modeSwitch.discardDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelConfirm}>{t('aiTable.modeSwitch.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSwitch}>
              {t('aiTable.modeSwitch.discardAndSwitch')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function AITableModeSwitch() {
  const { state, setMode, cancelDraft } = useAITable()
  return (
    <AITableModeSwitchControl
      mode={state.mode}
      modeTransition={state.modeTransition}
      dirty={state.dirty}
      setMode={setMode}
      cancelDraft={cancelDraft}
    />
  )
}
