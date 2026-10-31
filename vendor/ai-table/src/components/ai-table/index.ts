/**
 * AI Table 通用组件统一导出
 *
 * 通用组件禁止 import 业务 DTO、API 或常量。
 */

// 核心类型
export type {
  AITableFieldType,
  AITableFieldSource,
  AITableFieldOption,
  AITableField,
  AITableFilterOperator,
  AITableConjunction,
  AITableFilterRule,
  AITableGroupRule,
  AITableSortRule,
  AITableColorScope,
  AITableColorToken,
  AITablePaletteColorFamily,
  AITablePaletteColorShade,
  AITableColorRule,
  AITableAIFieldOutputType,
  AITableAIField,
  AITableViewConfig,
  AITableRowProjection,
  AITableGroup,
  AITableAIAdapter,
  AITableConfig,
  AITableMode,
  AITableModeTransition,
  AITableSwitchingLoaderCopy,
  AITableActivePanel,
  AITableGenerationState,
  AITableState,
} from './types'

export {
  createDefaultViewConfig,
  getOperatorsByFieldType,
} from './types'

export {
  COLOR_OPTIONS,
  COLOR_PALETTE_ROWS,
  getColorOption,
  getColorStyle,
  getRowMarkerStyle,
} from './color-palette'

// 引擎纯函数
export {
  applyFilters,
  applyGrouping,
  applySorting,
  flattenGroups,
  resolveColorRules,
  resolveColumnColorRules,
  normalizeFrozenColumnCount,
  isDirty,
  createRowProjection,
  normalizeViewConfig,
  generateId,
  getFieldById,
  getFilterSummary,
  getGroupSummary,
  getSortSummary,
  getColorSummary,
  UNGROUPED_LABEL,
} from './ai-table-engine'

// 存储工具
export {
  loadMode,
  saveMode,
  loadView,
  saveView,
  loadAIValues,
  saveAIValues,
  clearAIFieldValues,
  setAIFieldValue,
  type AIValueStore,
} from './ai-table-storage'

// Provider 和 Hook
export { AITableProvider, useAITable, type AITableContextValue } from './AITableProvider'

// 组件
export { AITableModeSwitch } from './AITableModeSwitch'
export { SmartTableSwitchingLoader, type SmartTableSwitchingLoaderProps } from './SmartTableSwitchingLoader'
export { AITableGlobalModeSwitch } from './AITableGlobalModeSwitch'
export { AITableShellProvider } from './AITableShellContext'
export { AITableClassicOnly, AITablePageHeader } from './AITableVisibility'
export { AITableToolbar } from './AITableToolbar'
export { AITableDraftBar } from './AITableDraftBar'
export { AIFilterPanel } from './AIFilterPanel'
export { AITableConditionBuilder } from './AITableConditionBuilder'
export { AIGroupingPanel } from './AIGroupingPanel'
export { AISortingPanel } from './AISortingPanel'
export { AIColorPanel } from './AIColorPanel'
export { AIFieldPanel } from './AIFieldPanel'
export { AITableFreezeBoundary } from './AITableFreezeBoundary'
export { AITableDataView, AITableContent, type AITableDataViewProps, type AITableContentProps } from './AITableDataView'
export {
  AIWmsDataTable,
  type AIWmsDataTableProps,
  type AIWmsDataTableAIProps,
  type AIWmsDataTableFieldOverride,
} from './AIWmsDataTable'
