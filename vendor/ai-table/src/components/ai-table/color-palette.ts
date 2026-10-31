import type { CSSProperties } from 'react'
import i18n from '../../i18n'
import type {
  AITableColorToken,
  AITablePaletteColorFamily,
  AITablePaletteColorShade,
} from './types'

export interface AITableColorOption {
  value: AITableColorToken
  label: string
  backgroundColor: string
  foregroundColor: string
}

interface PaletteFamily {
  family: AITablePaletteColorFamily
  label: string
  colors: readonly [string, string, string, string, string]
  darkTextOnLastShade?: boolean
}

const PALETTE_FAMILIES: readonly PaletteFamily[] = [
  { family: 'coral', label: i18n.t('aiTable.colorPalette.coral'), colors: ['#fff0ed', '#ffe0da', '#ffc2b6', '#ff9f8e', '#ff5c45'] },
  { family: 'orange', label: i18n.t('aiTable.colorPalette.orange'), colors: ['#fff4e8', '#ffe4c7', '#ffd09b', '#ffb85c', '#ff9200'], darkTextOnLastShade: true },
  { family: 'yellow', label: i18n.t('aiTable.colorPalette.yellow'), colors: ['#fffbe6', '#fff4bf', '#ffeb85', '#ffe15c', '#ffd400'], darkTextOnLastShade: true },
  { family: 'lime', label: i18n.t('aiTable.colorPalette.lime'), colors: ['#f6f9e8', '#e9f0c7', '#d7e39d', '#bfd36f', '#9fbd00'], darkTextOnLastShade: true },
  { family: 'green', label: i18n.t('aiTable.colorPalette.green'), colors: ['#eff8f1', '#d9efdd', '#b8dfbf', '#83ca8f', '#08b84a'] },
  { family: 'teal', label: i18n.t('aiTable.colorPalette.teal'), colors: ['#edf8f7', '#d5eeeb', '#abe0d9', '#6dcec3', '#12b3a3'] },
  { family: 'cyan', label: i18n.t('aiTable.colorPalette.cyan'), colors: ['#ebf8fc', '#ceeff8', '#9fe0f2', '#6ad0ec', '#39bfe7'], darkTextOnLastShade: true },
  { family: 'blue', label: i18n.t('aiTable.colorPalette.blue'), colors: ['#eef3ff', '#d9e5ff', '#b4cbff', '#8aaeff', '#4e82ed'] },
  { family: 'purple', label: i18n.t('aiTable.colorPalette.purple'), colors: ['#f5f1ff', '#e8ddff', '#d4c0ff', '#b99af5', '#8b5de7'] },
  { family: 'pink', label: i18n.t('aiTable.colorPalette.pink'), colors: ['#fff0fa', '#f8dced', '#efb9df', '#e28ecb', '#ca55af'] },
  { family: 'gray', label: i18n.t('aiTable.colorPalette.gray'), colors: ['#f5f5f5', '#e7e7e7', '#d2d2d2', '#b7b7b7', '#8e8e8e'] },
]

/** 色板按明度分行、色相分列，和用户原型的 5 × 11 结构一致。 */
export const COLOR_PALETTE_ROWS: readonly (readonly AITableColorOption[])[] = ([1, 2, 3, 4, 5] as const).map((shade) => (
  PALETTE_FAMILIES.map((family) => ({
    value: `${family.family}${shade}` as AITableColorToken,
    label: `${family.label} ${shade}`,
    backgroundColor: family.colors[shade - 1],
    foregroundColor: shade === 5 && !family.darkTextOnLastShade ? '#ffffff' : '#20242d',
  }))
))

export const COLOR_OPTIONS: readonly AITableColorOption[] = COLOR_PALETTE_ROWS.flat()

const COLOR_OPTION_MAP = new Map<AITableColorToken, AITableColorOption>(
  COLOR_OPTIONS.map((option) => [option.value, option]),
)

const LEGACY_COLOR_ALIASES: Record<string, AITableColorToken> = {
  red: 'coral4',
  lightRed: 'coral2',
  green: 'green4',
  lightGreen: 'green2',
  yellow: 'yellow3',
  blue: 'blue4',
  lightBlue: 'blue2',
}

export function getColorOption(token: AITableColorToken): AITableColorOption {
  const normalized = LEGACY_COLOR_ALIASES[token] ?? token
  return COLOR_OPTION_MAP.get(normalized) ?? COLOR_OPTION_MAP.get('coral4')!
}

export function getColorStyle(token?: AITableColorToken): CSSProperties | undefined {
  if (!token) return undefined
  const option = getColorOption(token)
  return {
    backgroundColor: option.backgroundColor,
    color: option.foregroundColor,
  }
}

export function getRowMarkerStyle(token?: AITableColorToken): CSSProperties | undefined {
  if (!token) return undefined
  return { boxShadow: `inset 3px 0 0 ${getColorOption(token).backgroundColor}` }
}

export function createPaletteToken(
  family: AITablePaletteColorFamily,
  shade: AITablePaletteColorShade,
): AITableColorToken {
  return `${family}${shade}`
}
