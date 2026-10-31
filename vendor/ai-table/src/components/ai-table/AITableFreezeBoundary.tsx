/**
 * AITableFreezeBoundary — 列冻结拖拽控制
 *
 * Demo 实现：在工具栏区域提供冻结列数量调整控件。
 * 正式版可扩展为表头上的直接拖拽手柄。
 */

import * as React from 'react'
import { useTranslation } from '../../i18n'
import { Pin, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useAITable } from './AITableProvider'
import { normalizeFrozenColumnCount } from './ai-table-engine'

export function AITableFreezeBoundary() {
  const { t } = useTranslation()
  const { config, state, updateDraft } = useAITable()
  const { draftView } = state
  const frozenCount = draftView.frozenColumnCount

  // 可见业务列数量（排除 __select__ 和 actions）
  const businessColumnCount = React.useMemo(() => {
    // 从 fields 中统计可冻结的业务列
    return config.fields.filter((f) => f.source === 'business' || f.source === 'derived').length
  }, [config.fields])

  const normalizedCount = normalizeFrozenColumnCount(frozenCount, businessColumnCount)

  function increase() {
    const next = normalizeFrozenColumnCount(
      normalizedCount + 1,
      businessColumnCount,
    )
    updateDraft({ frozenColumnCount: next })
  }

  function decrease() {
    const next = normalizeFrozenColumnCount(
      normalizedCount - 1,
      businessColumnCount,
    )
    updateDraft({ frozenColumnCount: next })
  }

  function clear() {
    updateDraft({ frozenColumnCount: 0 })
  }

  if (businessColumnCount === 0) return null

  return (
    <div className="flex items-center gap-2 border-t bg-card px-4 py-2 lg:px-6">
      <Pin className="size-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        {t('aiTable.freeze.frozenColumns')}
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          disabled={normalizedCount === 0}
          onClick={decrease}
        >
          <ChevronsLeft className="size-3.5" />
        </Button>
        <span className="min-w-[60px] text-center text-xs font-medium tabular-nums">
          {normalizedCount} / {businessColumnCount} {t('aiTable.freeze.columnUnit')}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          disabled={normalizedCount >= businessColumnCount - 1}
          onClick={increase}
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
      {normalizedCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={clear}
        >
          {t('aiTable.freeze.clearFreeze')}
        </Button>
      )}
      {normalizedCount === 0 && (
        <span className="text-xs text-muted-foreground">
          {t('aiTable.freeze.hint')}
        </span>
      )}
    </div>
  )
}
