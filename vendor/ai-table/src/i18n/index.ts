import zhCN from './locales/zh-CN.json'

// 纯中文实现：ai-table 已不需要多语言切换，仅保留 zh-CN 文案表。
// 保持 useTranslation() / i18n.t(key, fallback) 的调用形态不变，组件代码零改动。
type Messages = Record<string, string>

function flatten(node: unknown, prefix = ''): Messages {
  const result: Messages = {}
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const name = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') Object.assign(result, flatten(value, name))
    else if (typeof value === 'string') result[name] = value
  }
  return result
}

const messages = flatten(zhCN)

export type TFunction = (key: string, options?: string | Record<string, unknown>) => string

export function t(key: string, options?: string | Record<string, unknown>): string {
  let text = messages[key]
  if (text == null && typeof options === 'string') text = options
  if (text == null) return key
  if (options && typeof options === 'object') {
    for (const [name, value] of Object.entries(options)) {
      text = text.split(`{{${name}}}`).join(String(value))
    }
  }
  return text
}

export function useTranslation() {
  return { t }
}

export default { t }
