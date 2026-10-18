const AI_OPERATORS_BY_TYPE = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'notEmpty'],
  number: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'isEmpty', 'notEmpty'],
  tag: ['equals', 'notEquals', 'isEmpty', 'notEmpty'],
  date: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between', 'isToday', 'isPast', 'isFuture', 'withinPastDays', 'withinNextDays', 'isEmpty', 'notEmpty'],
  datetime: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between', 'isToday', 'isPast', 'isFuture', 'withinPastDays', 'withinNextDays', 'isEmpty', 'notEmpty'],
}

const AI_COLOR_TOKENS = ['red', 'lightRed', 'green', 'lightGreen', 'yellow', 'blue', 'lightBlue']
const AI_COLOR_SCOPES = ['cell', 'row', 'rowMarker', 'column']
const AI_MAX_FIELD_PREVIEW_ROWS = 50
const AI_RETRYABLE_CODES = new Set(['TRANSPORT', 'SERVER', 'TIMEOUT', 'RATE_LIMIT', 'EMPTY_RESPONSE', 'UNKNOWN'])
const AI_MAX_ATTEMPTS = 3

function aiOperatorsFor(type) {
  return AI_OPERATORS_BY_TYPE[type] ?? ['equals']
}

function aiFieldMetadata(fields) {
  return (fields ?? []).map((field) => ({ fieldId: field.fieldId, label: field.label, type: field.type, options: field.options ?? [] }))
}

function aiAllowedFields(fields) {
  // 客户端已按 aiReadable + filterable/colorable 过滤后只传字段元数据，宿主直接使用。
  return fields ?? []
}

async function aiComplete(ctx, { system, text, temperature = 0, maxTokens = 2000, signal, sessionId, model = 'deepseek-flash', reasoningEffort = 'off' }) {
  // 使用 deepseek-account（PKCE 登录，与当前 Agent 同一条路径）。
  // 模型与推理强度由用户在「模型设置」里选择，持久化后经 generate* 方法传入。
  const selection = { provider: 'deepseek-account', model, reasoningEffort }
  let lastFailure = null
  for (let attempt = 1; attempt <= AI_MAX_ATTEMPTS; attempt++) {
    let result = ''
    let finishError = null
    for await (const chunk of ctx.llm.stream({
      provider: selection.provider,
      model: selection.model,
      reasoningEffort: selection.reasoningEffort,
      system,
      messages: [{ role: 'user', content: [{ type: 'text', text }] }],
      temperature,
      maxTokens,
      signal,
      sessionId,
    })) {
      if (chunk.type === 'text-delta') {
        result += chunk.text
      } else if (chunk.type === 'finish' && chunk.reason) {
        if (chunk.reason.kind === 'error') {
          finishError = chunk.reason.failure ?? { message: '未知错误', code: 'UNKNOWN' }
        } else if (chunk.reason.kind === 'aborted') {
          throw new Error('AI 调用已取消')
        }
      }
    }
    if (!finishError) return result
    if (!AI_RETRYABLE_CODES.has(finishError.code) || attempt === AI_MAX_ATTEMPTS) {
      throw new Error(`AI 调用失败（${finishError.code}）：${finishError.message}`)
    }
    lastFailure = finishError
    ctx.logger.warn(`[procurement] AI 调用失败（${finishError.code}），第 ${attempt} 次重试`)
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
  }
  throw new Error(`AI 调用失败：${lastFailure?.message ?? '未知错误'}`)
}

function aiParseJson(text) {
  const trimmed = String(text ?? '').trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1].trim() : trimmed
  const arrayStart = body.indexOf('[')
  const objectStart = body.indexOf('{')
  let start = -1
  let end = -1
  if (arrayStart >= 0 && (objectStart < 0 || arrayStart < objectStart)) {
    start = arrayStart
    end = body.lastIndexOf(']')
  } else if (objectStart >= 0) {
    start = objectStart
    end = body.lastIndexOf('}')
  }
  if (start < 0 || end < start) throw new Error('AI 没有返回可解析的 JSON')
  return JSON.parse(body.slice(start, end + 1))
}

function aiValidateRule(value, fields, capability) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('AI 规则必须是对象')
  const field = fields.find((item) => item.fieldId === value.fieldId)
  if (!field) throw new Error(`未知或不可用的 AI 字段：${String(value.fieldId)}`)
  if (!aiOperatorsFor(field.type).includes(value.operator)) throw new Error(`字段「${field.label}」不支持操作符 ${String(value.operator)}`)
  if (typeof value.id !== 'string' || !value.id) throw new Error('AI 规则 id 必填')
  return field
}


export { AI_OPERATORS_BY_TYPE, AI_COLOR_TOKENS, AI_COLOR_SCOPES, AI_MAX_FIELD_PREVIEW_ROWS, AI_RETRYABLE_CODES, AI_MAX_ATTEMPTS, aiOperatorsFor, aiFieldMetadata, aiAllowedFields, aiComplete, aiParseJson, aiValidateRule }
