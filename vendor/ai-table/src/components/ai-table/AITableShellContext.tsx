/* oxlint-disable react/only-export-components -- provider and registration hooks form one shell contract */
import * as React from 'react'
import type { AITableMode, AITableModeTransition } from './types'

export interface AITableShellRegistration {
  tableId: string
  mode: AITableMode
  modeTransition: AITableModeTransition
  dirty: boolean
  setMode: (mode: AITableMode) => void
  cancelDraft: () => void
}

interface AITableShellContextValue {
  registration: AITableShellRegistration | null
  publish: (registration: AITableShellRegistration) => void
  clear: (tableId: string) => void
}

const AITableShellContext = React.createContext<AITableShellContextValue | null>(null)

export function AITableShellProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistration] = React.useState<AITableShellRegistration | null>(null)

  const publish = React.useCallback((next: AITableShellRegistration) => {
    setRegistration(next)
  }, [])

  const clear = React.useCallback((tableId: string) => {
    setRegistration((current) => current?.tableId === tableId ? null : current)
  }, [])

  const value = React.useMemo(
    () => ({ registration, publish, clear }),
    [clear, publish, registration],
  )

  return (
    <AITableShellContext.Provider value={value}>
      {children}
    </AITableShellContext.Provider>
  )
}

export function useAITableShellRegistration(
  registration: AITableShellRegistration,
) {
  const shell = React.useContext(AITableShellContext)
  const publish = shell?.publish
  const clear = shell?.clear

  React.useLayoutEffect(() => {
    publish?.(registration)
  }, [publish, registration])

  React.useEffect(() => {
    return () => clear?.(registration.tableId)
  }, [clear, registration.tableId])
}

export function useAITableShell() {
  return React.useContext(AITableShellContext)
}
