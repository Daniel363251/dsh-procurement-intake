/**
 * AI Table 的通用状态容器。
 *
 * 规则编辑始终写入 draftView；表格只使用 savedView 渲染。分组折叠和
 * 冻结边界属于即时视图反馈，可以在保存前预览。
 */
import * as React from 'react'
import i18n from '../../i18n'
import type {
  AITableActivePanel,
  AITableAIField,
  AITableColorToken,
  AITableConfig,
  AITableField,
  AITableGenerationState,
  AITableGroup,
  AITableFilterRule,
  AITableMode,
  AITableModeTransition,
  AITableRowProjection,
  AITableSortRule,
  AITableState,
  AITableViewConfig,
} from './types'
import { createDefaultViewConfig } from './types'
import {
  applyFilters,
  applyGrouping,
  applySorting,
  isDirty,
  normalizeViewConfig,
  resolveColumnColorRules,
  resolveColorRules,
} from './ai-table-engine'
import {
  clearAIFieldValues,
  loadAIValues,
  loadMode,
  loadView,
  saveAIValues,
  saveMode,
  saveView,
  type AIValueStore,
} from './ai-table-storage'
import { useAITableShellRegistration } from './AITableShellContext'
import {
  canGenerateAIFieldForRow,
  createAIFieldRowReferenceSignature,
} from './ai-field-generation'

const SMART_TABLE_SWITCH_DELAY_MS = 3_000

export interface AITableContextValue<TRow> {
  config: AITableConfig<TRow>
  state: AITableState
  rows: TRow[]
  totalCount: number
  serverQuery: boolean
  queryFieldIds?: string[]
  appliedFields: AITableField<TRow>[]
  draftFields: AITableField<TRow>[]
  setMode: (mode: AITableMode) => void
  updateDraft: (patch: Partial<AITableViewConfig>) => void
  updateSorts: (sorts: AITableSortRule[]) => void
  saveView: () => void
  restoreDefaultView: () => void
  cancelDraft: () => void
  setActivePanel: (panel: AITableActivePanel) => void
  setGenerationState: (state: AITableGenerationState) => void
  createAIField: (definition: AITableAIField) => Promise<void>
  removeAIField: (fieldId: string) => void
  regenerateAIFieldValues: (fieldId: string) => Promise<void>
  projections: AITableRowProjection<TRow>[]
  filteredRows: TRow[]
  sortedRows: TRow[]
  visibleRows: TRow[]
  groups: AITableGroup<TRow>[]
  rowColors: Map<string, AITableColorToken>
  rowMarkerColors: Map<string, AITableColorToken>
  cellColors: Map<string, Map<string, AITableColorToken>>
  columnColors: Map<string, AITableColorToken>
  aiValues: AIValueStore
}

const AITableContext = React.createContext<AITableContextValue<unknown> | null>(null)

export function useAITable<TRow>(): AITableContextValue<TRow> {
  const context = React.useContext(AITableContext)
  if (!context) throw new Error('useAITable must be used within AITableProvider')
  return context as AITableContextValue<TRow>
}

export interface AITableProviderProps<TRow> {
  config: AITableConfig<TRow>
  rows: TRow[]
  totalCount: number
  onQueryChange?: (query: { filters: AITableFilterRule[]; sorts: AITableSortRule[] }) => void
  queryFieldIds?: string[]
  defaultMode?: AITableMode
  /** Force a mode regardless of saved preferences; mode changes are ignored while locked. */
  modeLock?: AITableMode
  children: React.ReactNode
}

export function AITableProvider<TRow>({
  config,
  rows,
  totalCount,
  onQueryChange,
  queryFieldIds,
  defaultMode = 'classic',
  modeLock,
  children,
}: AITableProviderProps<TRow>) {
  const { tableId, fields, rowKey } = config
  const queryableFieldIds = React.useMemo(() => queryFieldIds ? new Set(queryFieldIds) : null, [queryFieldIds])
  const initialView = React.useMemo(
    () => {
      const view = normalizeViewConfig(loadView(tableId), fields)
      if (!queryableFieldIds) return view
      return {
        ...view,
        filters: view.filters.filter((rule) => queryableFieldIds.has(rule.fieldId)),
        sorts: view.sorts.filter((sort) => queryableFieldIds.has(sort.fieldId)),
      }
    },
    [fields, queryableFieldIds, tableId],
  )
  const [mode, setModeState] = React.useState<AITableMode>(() => modeLock ?? loadMode(tableId, defaultMode))
  const [modeTransition, setModeTransition] = React.useState<AITableModeTransition>('idle')
  const [savedView, setSavedView] = React.useState<AITableViewConfig>(initialView)
  const [draftView, setDraftView] = React.useState<AITableViewConfig>(initialView)
  const [activePanel, setActivePanel] = React.useState<AITableActivePanel>(null)
  const [generationState, setGenerationState] = React.useState<AITableGenerationState>('idle')
  const [aiValues, setAIValues] = React.useState<AIValueStore>(() => loadAIValues(tableId))
  const lastServerQuerySignature = React.useRef<string | null>(null)
  const modeSwitchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoUpdateSignaturesRef = React.useRef(new Map<string, Map<string, string>>())
  const autoUpdateInFlightRef = React.useRef(new Set<string>())

  const dirty = React.useMemo(() => isDirty(savedView, draftView), [savedView, draftView])
  const state = React.useMemo<AITableState>(() => ({
    mode,
    modeTransition,
    savedView,
    draftView,
    activePanel,
    generationState,
    dirty,
  }), [activePanel, dirty, draftView, generationState, mode, modeTransition, savedView])

  const setMode = React.useCallback((nextMode: AITableMode) => {
    if (modeLock) {
      if (modeSwitchTimerRef.current !== null) {
        clearTimeout(modeSwitchTimerRef.current)
        modeSwitchTimerRef.current = null
      }
      setModeTransition('idle')
      setModeState(modeLock)
      setActivePanel(null)
      return
    }
    setActivePanel(null)

    if (nextMode === 'smart' && mode === 'classic') {
      if (modeSwitchTimerRef.current !== null) return
      setModeTransition('switching-to-smart')
      modeSwitchTimerRef.current = setTimeout(() => {
        setModeState('smart')
        saveMode(tableId, 'smart')
        setModeTransition('idle')
        modeSwitchTimerRef.current = null
      }, SMART_TABLE_SWITCH_DELAY_MS)
      return
    }

    if (modeSwitchTimerRef.current !== null) {
      clearTimeout(modeSwitchTimerRef.current)
      modeSwitchTimerRef.current = null
    }
    setModeTransition('idle')
    setModeState(nextMode)
    saveMode(tableId, nextMode)
  }, [mode, modeLock, tableId])

  React.useEffect(() => {
    if (!modeLock) return
    if (modeSwitchTimerRef.current !== null) {
      clearTimeout(modeSwitchTimerRef.current)
      modeSwitchTimerRef.current = null
    }
    setModeTransition('idle')
    setModeState(modeLock)
    setActivePanel(null)
  }, [modeLock])

  React.useEffect(() => () => {
    if (modeSwitchTimerRef.current !== null) {
      clearTimeout(modeSwitchTimerRef.current)
    }
  }, [])

  const updateDraft = React.useCallback((patch: Partial<AITableViewConfig>) => {
    setDraftView((previous) => ({ ...previous, ...patch }))
  }, [])

  const updateSorts = React.useCallback((sorts: AITableSortRule[]) => {
    const normalized = normalizeViewConfig({ ...savedView, sorts: queryableFieldIds ? sorts.filter((sort) => queryableFieldIds.has(sort.fieldId)) : sorts }, fields)
    setSavedView(normalized)
    setDraftView((previous) => ({ ...previous, sorts: normalized.sorts }))
    saveView(tableId, normalized)
  }, [fields, queryableFieldIds, savedView, tableId])

  const saveViewAction = React.useCallback(() => {
    const base = normalizeViewConfig(draftView, fields)
    const normalized = queryableFieldIds ? {
      ...base,
      filters: base.filters.filter((rule) => queryableFieldIds.has(rule.fieldId)),
      sorts: base.sorts.filter((sort) => queryableFieldIds.has(sort.fieldId)),
    } : base
    setSavedView(normalized)
    setDraftView(normalized)
    saveView(tableId, normalized)
    setAIValues((previous) => {
      const retainedFieldIds = new Set(normalized.aiFields.map((field) => field.fieldId))
      const next = Object.fromEntries(
        Object.entries(previous).filter(([fieldId]) => retainedFieldIds.has(fieldId)),
      )
      saveAIValues(tableId, next)
      return next
    })
    setActivePanel(null)
  }, [draftView, fields, queryableFieldIds, tableId])

  const restoreDefaultView = React.useCallback(() => {
    // Reset view behavior while retaining user-created AI columns and their values.
    const defaults = normalizeViewConfig({
      ...createDefaultViewConfig(),
      aiFields: savedView.aiFields,
    }, fields)
    setSavedView(defaults)
    setDraftView(defaults)
    saveView(tableId, defaults)
    setActivePanel(null)
  }, [fields, savedView.aiFields, tableId])

  const cancelDraft = React.useCallback(() => {
    setDraftView(savedView)
    setActivePanel(null)
  }, [savedView])

  const serverQuerySignature = JSON.stringify([savedView.filters, savedView.sorts])
  React.useEffect(() => {
    if (!onQueryChange || lastServerQuerySignature.current === serverQuerySignature) return
    lastServerQuerySignature.current = serverQuerySignature
    onQueryChange({ filters: savedView.filters, sorts: savedView.sorts })
  }, [onQueryChange, savedView.filters, savedView.sorts, serverQuerySignature])

  const shellRegistration = React.useMemo(() => ({
    tableId,
    mode,
    modeTransition,
    dirty,
    setMode,
    cancelDraft,
  }), [cancelDraft, dirty, mode, modeTransition, setMode, tableId])
  useAITableShellRegistration(shellRegistration)

  const buildFieldRegistry = React.useCallback((definitions: AITableAIField[]) => {
    const dynamicFields: AITableField<TRow>[] = definitions.map((definition) => ({
      fieldId: definition.fieldId,
      label: definition.name,
      type: definition.outputType,
      source: 'ai',
      getValue: (row) => aiValues[definition.fieldId]?.[rowKey(row)],
      filterable: true,
      groupable: true,
      colorable: true,
      sortable: true,
      aiReadable: true,
      formatValue: (value) => formatAIValue(value),
    }))
    return [...fields, ...dynamicFields]
  }, [aiValues, fields, rowKey])

  const appliedFields = React.useMemo(
    () => buildFieldRegistry(savedView.aiFields),
    [buildFieldRegistry, savedView.aiFields],
  )
  const draftFields = React.useMemo(
    () => buildFieldRegistry(draftView.aiFields),
    [buildFieldRegistry, draftView.aiFields],
  )

  const filteredRows = React.useMemo(
    () => onQueryChange ? rows : applyFilters(rows, savedView.filters, appliedFields),
    [appliedFields, onQueryChange, rows, savedView.filters],
  )

  const sortedRows = React.useMemo(
    () => onQueryChange ? filteredRows : applySorting(filteredRows, savedView.sorts, appliedFields),
    [appliedFields, filteredRows, onQueryChange, savedView.sorts],
  )

  // 折叠是即时反馈；规则本身仍严格使用已保存配置。
  const effectiveCollapsedKeys = React.useMemo(
    () => isSameGroupConfiguration(savedView.groups, draftView.groups)
      ? draftView.collapsedGroupKeys
      : savedView.collapsedGroupKeys,
    [draftView.collapsedGroupKeys, draftView.groups, savedView.collapsedGroupKeys, savedView.groups],
  )

  const groups = React.useMemo(
    () => applyGrouping(sortedRows, savedView.groups, appliedFields, effectiveCollapsedKeys),
    [appliedFields, effectiveCollapsedKeys, savedView.groups, sortedRows],
  )

  const visibleRows = React.useMemo(() => {
    if (!groups.length) return sortedRows
    const result: TRow[] = []
    const walk = (items: AITableGroup<TRow>[]) => {
      for (const group of items) {
        if (group.collapsed) continue
        if (group.children?.length) walk(group.children)
        else result.push(...group.rows)
      }
    }
    walk(groups)
    return result
  }, [groups, sortedRows])

  const projections = React.useMemo(() => rows.map((row) => {
    const key = rowKey(row)
    const derivedValues = Object.fromEntries(
      fields
        .filter((field) => field.source === 'derived')
        .map((field) => [field.fieldId, field.getValue(row)]),
    )
    const rowAIValues = Object.fromEntries(
      savedView.aiFields
        .map((field) => [field.fieldId, aiValues[field.fieldId]?.[key]])
        .filter(([, value]) => value !== undefined),
    )
    return { rowKey: key, source: row, derivedValues, aiValues: rowAIValues }
  }), [aiValues, fields, rowKey, rows, savedView.aiFields])

  const { rowColors, rowMarkerColors, cellColors, columnColors } = React.useMemo(() => {
    const nextRowColors = new Map<string, AITableColorToken>()
    const nextRowMarkerColors = new Map<string, AITableColorToken>()
    const nextCellColors = new Map<string, Map<string, AITableColorToken>>()
    for (const row of filteredRows) {
      const key = rowKey(row)
      const result = resolveColorRules(row, savedView.colorRules, appliedFields)
      if (result.rowColor) nextRowColors.set(key, result.rowColor)
      if (result.rowMarkerColor) nextRowMarkerColors.set(key, result.rowMarkerColor)
      if (result.cellColors.size) nextCellColors.set(key, result.cellColors)
    }
    return {
      rowColors: nextRowColors,
      rowMarkerColors: nextRowMarkerColors,
      cellColors: nextCellColors,
      columnColors: resolveColumnColorRules(savedView.colorRules),
    }
  }, [appliedFields, filteredRows, rowKey, savedView.colorRules])

  const executeAIField = React.useCallback(async (
    definition: AITableAIField,
    targetRows: TRow[],
    registry: AITableField<TRow>[],
  ) => {
    const runnableRows = targetRows.filter((row) =>
      canGenerateAIFieldForRow(definition, row, registry),
    )
    const skippedRowKeys = targetRows
      .filter((row) => !canGenerateAIFieldForRow(definition, row, registry))
      .map(rowKey)
    const results = runnableRows.length
      ? await config.aiAdapter.previewAIField({
          definition,
          rows: runnableRows,
          rowKey,
          fields: registry,
        })
      : []
    setAIValues((previous) => {
      const next = { ...previous, [definition.fieldId]: { ...(previous[definition.fieldId] ?? {}) } }
      for (const skippedRowKey of skippedRowKeys) {
        delete next[definition.fieldId][skippedRowKey]
      }
      for (const result of results) {
        if (!result.error) next[definition.fieldId][result.rowKey] = result.value
      }
      saveAIValues(tableId, next)
      return next
    })
  }, [config.aiAdapter, rowKey, tableId])

  const createAIField = React.useCallback(async (definition: AITableAIField) => {
    await executeAIField(definition, filteredRows, draftFields)
    const nextView = {
      ...draftView,
      aiFields: [...draftView.aiFields.filter((field) => field.fieldId !== definition.fieldId), definition],
    }
    setDraftView(nextView)
    setSavedView(nextView)
    saveView(tableId, nextView)
    setActivePanel(null)
  }, [draftFields, draftView, executeAIField, filteredRows, tableId])

  const regenerateAIFieldValues = React.useCallback(async (fieldId: string) => {
    const definition = draftView.aiFields.find((field) => field.fieldId === fieldId)
    if (!definition) return
    await executeAIField(definition, filteredRows, draftFields)
  }, [draftFields, draftView.aiFields, executeAIField, filteredRows])

  React.useEffect(() => {
    const autoUpdateFields = savedView.aiFields.filter((field) => field.autoUpdate)
    const activeFieldIds = new Set(autoUpdateFields.map((field) => field.fieldId))

    for (const fieldId of autoUpdateSignaturesRef.current.keys()) {
      if (!activeFieldIds.has(fieldId)) autoUpdateSignaturesRef.current.delete(fieldId)
    }

    for (const definition of autoUpdateFields) {
      if (autoUpdateInFlightRef.current.has(definition.fieldId)) continue

      const previousSignatures = autoUpdateSignaturesRef.current.get(definition.fieldId)
      const currentSignatures = new Map(rows.map((row) => [
        rowKey(row),
        createAIFieldRowReferenceSignature(definition, row, appliedFields),
      ]))
      const changedRows = rows.filter((row) => {
        const key = rowKey(row)
        if (previousSignatures) {
          return previousSignatures.get(key) !== currentSignatures.get(key)
        }

        // Cached AI values have no durable source signatures. Re-evaluate auto-update
        // fields on mount so changed server rows cannot silently retain stale results.
        return true
      })

      autoUpdateSignaturesRef.current.set(definition.fieldId, currentSignatures)
      if (!changedRows.length) continue

      autoUpdateInFlightRef.current.add(definition.fieldId)
      void executeAIField(definition, changedRows, appliedFields).catch(() => {
        setGenerationState('error')
      }).finally(() => {
        autoUpdateInFlightRef.current.delete(definition.fieldId)
      })
    }
  }, [aiValues, appliedFields, executeAIField, rowKey, rows, savedView.aiFields])

  const removeAIField = React.useCallback((fieldId: string) => {
    setDraftView((previous) => ({
      ...previous,
      aiFields: previous.aiFields.filter((field) => field.fieldId !== fieldId),
      filters: previous.filters.filter((rule) => rule.fieldId !== fieldId),
      groups: previous.groups.filter((group) => group.fieldId !== fieldId),
      sorts: previous.sorts.filter((sort) => sort.fieldId !== fieldId),
      colorRules: previous.colorRules.filter((rule) => rule.fieldId !== fieldId),
    }))
    // 连带清掉该字段的计算结果，避免留下孤儿数据。
    setAIValues(clearAIFieldValues(tableId, fieldId))
  }, [tableId])

  const value: AITableContextValue<TRow> = {
    config,
    state,
    rows,
    totalCount,
    serverQuery: Boolean(onQueryChange),
    queryFieldIds,
    appliedFields,
    draftFields,
    setMode,
    updateDraft,
    updateSorts,
    saveView: saveViewAction,
    restoreDefaultView,
    cancelDraft,
    setActivePanel,
    setGenerationState,
    createAIField,
    removeAIField,
    regenerateAIFieldValues,
    projections,
    filteredRows,
    sortedRows,
    visibleRows,
    groups,
    rowColors,
    rowMarkerColors,
    cellColors,
    columnColors,
    aiValues,
  }

  return (
    <AITableContext.Provider value={value as AITableContextValue<unknown>}>
      {children}
    </AITableContext.Provider>
  )
}

function isSameGroupConfiguration(
  left: AITableViewConfig['groups'],
  right: AITableViewConfig['groups'],
) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function formatAIValue(value: unknown) {
  const normalized = String(value ?? '').toUpperCase()
  if (normalized === 'HIGH') return i18n.t('aiTable.badge.highRisk')
  if (normalized === 'MEDIUM') return i18n.t('aiTable.badge.mediumRisk')
  if (normalized === 'LOW') return i18n.t('aiTable.badge.lowRisk')
  if (normalized === 'ATTENTION') return i18n.t('aiTable.badge.attention')
  if (normalized === 'NORMAL') return i18n.t('aiTable.badge.normal')
  return String(value ?? '')
}
