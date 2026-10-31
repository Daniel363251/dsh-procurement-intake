/**
 * useColumnSettings — 列设置持久化 hook
 *
 * 管理 WmsDataTable 的列显示/隐藏、顺序、行高密度，并按 storageKey
 * 持久化到 localStorage。与 UI 无关，可独立测试。
 *
 * 当 storageKey='__noop__' 或 fields 为空时安全 no-op。
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { VisibilityState } from '@tanstack/react-table'

// ─── 类型定义 ─────────────────────────────────────────────

export type WmsTableDensity = 'compact' | 'medium' | 'relaxed'

/** 列设置状态（持久化到 localStorage） */
export type WmsColumnSettingsState = {
  /** 所有用户可控列的 ID 顺序 */
  order: string[]
  /** 当前可见列的 ID 列表 */
  visible: string[]
  /** 表格行高密度 */
  density: WmsTableDensity
}

/** 列元数据（由 DataTable 从 ColumnDef 自动推导） */
export type WmsColumnField = {
  id: string
  label: string
  /** 分组名，用于列设置面板分组展示 */
  group?: string
  /** true → 不可隐藏（对应 enableHiding: false） */
  required?: boolean
  /** true → 锁定为表格第一列：不可隐藏、不可拖拽调整顺序 */
  pinned?: boolean
  /** false → 默认隐藏 */
  defaultVisible?: boolean
}

// ─── 辅助函数 ─────────────────────────────────────────────

/** 构建默认状态 */
export function getDefaultState(
  fields: WmsColumnField[],
  defaultDensity: WmsTableDensity = 'medium',
): WmsColumnSettingsState {
  return {
    order: fields.map((f) => f.id),
    visible: fields
      .filter((f) => f.required || f.defaultVisible !== false)
      .map((f) => f.id),
    density: defaultDensity,
  }
}

/**
 * 归一化状态：确保 order 包含所有 fieldId（新增字段自动追加）、
 * required 字段不被从 visible 中移除。
 */
export function normalizeState(
  state: Partial<WmsColumnSettingsState> | null,
  fields: WmsColumnField[],
  defaultDensity: WmsTableDensity = 'medium',
): WmsColumnSettingsState {
  if (!state || fields.length === 0) {
    return getDefaultState(fields, defaultDensity)
  }

  const fieldIds = fields.map((f) => f.id)
  const fieldIdSet = new Set(fieldIds)
  const requiredIds = fields.filter((f) => f.required).map((f) => f.id)
  const defaultState = getDefaultState(fields, defaultDensity)

  // order：保留有效 ID，追加新字段
  const order = Array.from(
    new Set((state.order ?? []).filter((id) => fieldIdSet.has(id))),
  )
  for (const id of fieldIds) {
    if (!order.includes(id)) {
      order.push(id)
    }
  }

  // pinned 字段强制移到 order 最前（第一列不允许被调整顺序）
  const pinnedIds = fields.filter((f) => f.pinned).map((f) => f.id)
  for (let i = pinnedIds.length - 1; i >= 0; i--) {
    const index = order.indexOf(pinnedIds[i])
    if (index > 0) {
      order.splice(index, 1)
      order.unshift(pinnedIds[i])
    }
  }

  // visible：保留有效 ID，确保 required 字段不被移除
  let visible = Array.from(
    new Set((state.visible ?? []).filter((id) => fieldIdSet.has(id))),
  )
  if (visible.length === 0) {
    visible = [...defaultState.visible]
  }
  for (const id of requiredIds) {
    if (!visible.includes(id)) {
      visible.push(id)
    }
  }

  return {
    order,
    visible,
    density: state.density ?? defaultDensity,
  }
}

// ─── Hook ─────────────────────────────────────────────────

const NOOP_STORAGE_KEY = '__noop__'

export function useColumnSettings(options: {
  storageKey: string
  fields: WmsColumnField[]
  defaultDensity?: WmsTableDensity
}): {
  /** 当前列设置状态 */
  state: WmsColumnSettingsState
  /** 默认状态（用于"恢复默认"） */
  defaultState: WmsColumnSettingsState
  /** 应用新状态（normalize + setState + localStorage.setItem） */
  applyState: (next: WmsColumnSettingsState) => void
  /** 直接给 TanStack Table 用的 VisibilityState */
  columnVisibility: VisibilityState
  /** 当前行高密度 */
  density: WmsTableDensity
} {
  const { storageKey, fields, defaultDensity = 'medium' } = options

  const defaultState = useMemo(
    () => getDefaultState(fields, defaultDensity),
    [fields, defaultDensity],
  )

  const [state, setState] = useState<WmsColumnSettingsState>(defaultState)

  // 首次加载：从 localStorage 读 → normalize → set state
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (storageKey === NOOP_STORAGE_KEY || fields.length === 0) {
      return
    }

    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        setState(defaultState)
        return
      }
      const parsed = JSON.parse(raw) as Partial<WmsColumnSettingsState>
      setState(normalizeState(parsed, fields, defaultDensity))
    } catch {
      setState(defaultState)
    }
  }, [storageKey, defaultState, fields, defaultDensity])

  const applyState = useCallback(
    (next: WmsColumnSettingsState) => {
      const normalized = normalizeState(next, fields, defaultDensity)
      setState(normalized)

      if (
        typeof window !== 'undefined' &&
        storageKey !== NOOP_STORAGE_KEY &&
        fields.length > 0
      ) {
        window.localStorage.setItem(storageKey, JSON.stringify(normalized))
      }
    },
    [storageKey, fields, defaultDensity],
  )

  // 派生：TanStack Table 的 VisibilityState
  const columnVisibility = useMemo<VisibilityState>(() => {
    const vis: Record<string, boolean> = {}
    for (const field of fields) {
      vis[field.id] = state.visible.includes(field.id)
    }
    return vis
  }, [state.visible, fields])

  return {
    state,
    defaultState,
    applyState,
    columnVisibility,
    density: state.density,
  }
}
