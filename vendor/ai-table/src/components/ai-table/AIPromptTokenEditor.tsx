import * as React from 'react'
import { useTranslation } from '../../i18n'
import i18n from '../../i18n'

interface PromptField {
  fieldId: string
  label: string
}

export interface AIPromptTokenEditorHandle {
  insertField: (field: PromptField) => void
}

interface AIPromptTokenEditorProps {
  value: string
  fields: PromptField[]
  onChange: (value: string) => void
  placeholder?: string
}

const TOKEN_PATTERN = /\{\{([^}]+)\}\}/g

/** 在界面中展示字段胶囊，同时继续以 {{fieldId}} 形式保存，兼容 AI 适配器。 */
export const AIPromptTokenEditor = React.forwardRef<AIPromptTokenEditorHandle, AIPromptTokenEditorProps>(
  function AIPromptTokenEditor({ value, fields, onChange, placeholder }, forwardedRef) {
    const { t } = useTranslation()
    const editorRef = React.useRef<HTMLDivElement>(null)
    const lastRangeRef = React.useRef<Range | null>(null)
    const serializedValueRef = React.useRef(value)

    const fieldMap = React.useMemo(() => new Map(fields.map((field) => [field.fieldId, field])), [fields])

    const renderValue = React.useCallback((nextValue: string) => {
      const editor = editorRef.current
      if (!editor) return
      editor.replaceChildren()
      let lastIndex = 0
      for (const match of nextValue.matchAll(TOKEN_PATTERN)) {
        const index = match.index ?? 0
        if (index > lastIndex) editor.append(document.createTextNode(nextValue.slice(lastIndex, index)))
        const fieldId = match[1]
        editor.append(createTokenElement(fieldId, fieldMap.get(fieldId)?.label ?? fieldId))
        lastIndex = index + match[0].length
      }
      if (lastIndex < nextValue.length) editor.append(document.createTextNode(nextValue.slice(lastIndex)))
    }, [fieldMap])

    React.useLayoutEffect(() => {
      if (serializedValueRef.current === value && editorRef.current?.childNodes.length) return
      serializedValueRef.current = value
      renderValue(value)
    }, [renderValue, value])

    const emitChange = React.useCallback(() => {
      const nextValue = serializeEditor(editorRef.current)
      serializedValueRef.current = nextValue
      onChange(nextValue)
    }, [onChange])

    const rememberSelection = React.useCallback(() => {
      const editor = editorRef.current
      const selection = window.getSelection()
      if (!editor || !selection?.rangeCount) return
      const range = selection.getRangeAt(0)
      if (editor.contains(range.commonAncestorContainer)) lastRangeRef.current = range.cloneRange()
    }, [])

    React.useImperativeHandle(forwardedRef, () => ({
      insertField(field) {
        const editor = editorRef.current
        if (!editor) return
        editor.focus()
        const selection = window.getSelection()
        const rememberedRange = lastRangeRef.current
        const range = rememberedRange && editor.contains(rememberedRange.commonAncestorContainer)
          ? rememberedRange
          : document.createRange()
        if (!rememberedRange || !editor.contains(rememberedRange.commonAncestorContainer)) {
          range.selectNodeContents(editor)
          range.collapse(false)
        }
        range.deleteContents()
        const token = createTokenElement(field.fieldId, field.label)
        const trailingSpace = document.createTextNode('\u00a0')
        range.insertNode(trailingSpace)
        range.insertNode(token)
        range.setStartAfter(trailingSpace)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
        lastRangeRef.current = range.cloneRange()
        emitChange()
      },
    }), [emitChange])

    return (
      <div
        ref={editorRef}
        role="textbox"
        aria-label={t('aiTable.aiField.promptAriaLabel')}
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className="min-h-28 whitespace-pre-wrap break-words px-3 py-2 text-sm leading-6 outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        onInput={emitChange}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={rememberSelection}
      />
    )
  },
)

function createTokenElement(fieldId: string, label: string) {
  const token = document.createElement('span')
  token.dataset.aiFieldToken = fieldId
  token.contentEditable = 'false'
  token.className = 'mx-0.5 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 align-baseline text-xs font-medium leading-5 text-primary'
  token.setAttribute('aria-label', i18n.t('aiTable.aiField.tokenAriaLabel', { label }))

  const icon = document.createElement('span')
  icon.textContent = 'ƒx'
  icon.className = 'inline-flex text-[10px] font-semibold opacity-70'
  token.append(icon, document.createTextNode(label))
  return token
}

function serializeEditor(editor: HTMLDivElement | null): string {
  if (!editor) return ''
  return Array.from(editor.childNodes).map(serializeNode).join('').replaceAll('\u00a0', ' ')
}

function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
  if (!(node instanceof HTMLElement)) return ''
  const fieldId = node.dataset.aiFieldToken
  if (fieldId) return `{{${fieldId}}}`
  if (node.tagName === 'BR') return '\n'
  const content = Array.from(node.childNodes).map(serializeNode).join('')
  return node.tagName === 'DIV' ? `\n${content}` : content
}
