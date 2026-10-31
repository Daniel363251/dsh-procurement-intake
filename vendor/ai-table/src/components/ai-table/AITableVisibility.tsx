import type { ReactNode } from 'react'
import { useAITable } from './AITableProvider'

export function AITableClassicOnly({ children }: { children: ReactNode }) {
  const { state } = useAITable()
  const showClassicContent = state.mode === 'classic' && state.modeTransition === 'idle'
  return showClassicContent ? <>{children}</> : null
}

export function AITablePageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      {actions}
    </div>
  )
}
