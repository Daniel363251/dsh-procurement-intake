/**
 * AI Table localStorage 持久化
 *
 * 按 tableId 隔离，JSON 解析失败时静默回落默认值。
 * Key 格式：ai-table-plugin:v1:{tableId}:{suffix}
 */

import type { AITableMode, AITableViewConfig } from './types'
import { createDefaultViewConfig } from './types'

const KEY_PREFIX = 'ai-table-plugin:v1'

function modeKey(tableId: string): string {
  return `${KEY_PREFIX}:${tableId}:mode`
}

function viewKey(tableId: string): string {
  return `${KEY_PREFIX}:${tableId}:view`
}

function aiValuesKey(tableId: string): string {
  return `${KEY_PREFIX}:${tableId}:ai-values`
}

// ─── 模式偏好 ─────────────────────────────────────────────

export function loadMode(tableId: string, defaultMode: AITableMode = 'classic'): AITableMode {
  if (typeof window === 'undefined') return defaultMode
  try {
    const raw = window.localStorage.getItem(modeKey(tableId))
    if (raw === 'smart' || raw === 'classic') return raw
    return defaultMode
  } catch {
    return defaultMode
  }
}

export function saveMode(tableId: string, mode: AITableMode): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(modeKey(tableId), mode)
  } catch {
    // 静默忽略
  }
}

// ─── 视图配置 ─────────────────────────────────────────────

export function loadView(tableId: string): AITableViewConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(viewKey(tableId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AITableViewConfig>
    return {
      ...createDefaultViewConfig(),
      ...parsed,
    }
  } catch {
    return null
  }
}

export function saveView(tableId: string, config: AITableViewConfig): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(viewKey(tableId), JSON.stringify(config))
  } catch {
    // 静默忽略
  }
}

// ─── AI 字段结果 ──────────────────────────────────────────

/** AI 值索引：{ [fieldId]: { [rowKey]: value } } */
export type AIValueStore = Record<string, Record<string, unknown>>

export function loadAIValues(tableId: string): AIValueStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(aiValuesKey(tableId))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as AIValueStore
    }
    return {}
  } catch {
    return {}
  }
}

export function saveAIValues(tableId: string, values: AIValueStore): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(aiValuesKey(tableId), JSON.stringify(values))
  } catch {
    // 静默忽略
  }
}

/** 删除某个 AI 字段的所有结果 */
export function clearAIFieldValues(
  tableId: string,
  fieldId: string,
): AIValueStore {
  const values = loadAIValues(tableId)
  delete values[fieldId]
  saveAIValues(tableId, values)
  return values
}

/** 为某行某字段设置 AI 值 */
export function setAIFieldValue(
  tableId: string,
  fieldId: string,
  rowKey: string,
  value: unknown,
): AIValueStore {
  const values = loadAIValues(tableId)
  if (!values[fieldId]) {
    values[fieldId] = {}
  }
  values[fieldId][rowKey] = value
  saveAIValues(tableId, values)
  return values
}
