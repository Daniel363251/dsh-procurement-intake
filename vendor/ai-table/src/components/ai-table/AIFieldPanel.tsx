import * as React from 'react'
import { useTranslation } from '../../i18n'
import { Bot, CheckCircle2, HelpCircle, Loader2, Plus, RefreshCw, Trash2, X } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import i18n from '../../i18n'
import { AIPromptTokenEditor, type AIPromptTokenEditorHandle } from './AIPromptTokenEditor'
import { useAITable } from './AITableProvider'
import { canGenerateAIFieldForRow } from './ai-field-generation'
import { generateId } from './ai-table-engine'
import type { AITableAIField, AITableAIFieldOutputType } from './types'

type PreviewStatus = 'waiting' | 'running' | 'success' | 'error' | 'skipped'
interface PreviewRow {
  rowKey: string
  status: PreviewStatus
  value?: unknown
  error?: string
}

export function AIFieldPanel() {
  const { t } = useTranslation()
  const {
    config,
    draftFields,
    state,
    filteredRows,
    createAIField,
    removeAIField,
    regenerateAIFieldValues,
    saveView,
    setActivePanel,
  } = useAITable()
  const [fieldId, setFieldId] = React.useState(() => generateId('aiField'))
  const [name, setName] = React.useState('')
  const [outputType, setOutputType] = React.useState<AITableAIFieldOutputType>('tag')
  const [prompt, setPrompt] = React.useState('')
  const [autoUpdate, setAutoUpdate] = React.useState(false)
  const [allowEmptyReferencedValues, setAllowEmptyReferencedValues] = React.useState(false)
  const [previewRows, setPreviewRows] = React.useState<PreviewRow[]>([])
  const [requestError, setRequestError] = React.useState<string | null>(null)
  const [running, setRunning] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [fieldPickerOpen, setFieldPickerOpen] = React.useState(false)
  const promptEditorRef = React.useRef<AIPromptTokenEditorHandle>(null)
  const readableFields = draftFields.filter((field) => field.aiReadable && field.fieldId !== fieldId)
  const referencedFieldIds = React.useMemo(() => getReferencedFieldIds(prompt), [prompt])
  const definition: AITableAIField = {
    fieldId,
    name,
    outputType,
    prompt,
    referencedFieldIds,
    autoUpdate,
    allowEmptyReferencedValues,
  }
  const canRun = Boolean(name.trim() && prompt.trim() && filteredRows.length)
  const canSave = canRun || state.dirty

  async function preview() {
    if (!canRun || running) return
    const targets = filteredRows.slice(0, 5)
    setRunning(true)
    setRequestError(null)
    setPreviewRows(targets.map((row, index) => ({
      rowKey: config.rowKey(row),
      status: index === 0 ? 'running' : 'waiting',
    })))
    try {
      const runnableRows = targets.filter((row) =>
        canGenerateAIFieldForRow(definition, row, draftFields),
      )
      const results = runnableRows.length
        ? await config.aiAdapter.previewAIField({
            definition,
            rows: runnableRows,
            rowKey: config.rowKey,
            fields: draftFields,
          })
        : []
      const resultByRowKey = new Map(results.map((result) => [result.rowKey, result]))
      setPreviewRows(targets.map((row) => {
        const rowKey = config.rowKey(row)
        if (!canGenerateAIFieldForRow(definition, row, draftFields)) {
          return { rowKey, status: 'skipped' as const }
        }
        const result = resultByRowKey.get(rowKey)
        return {
          rowKey,
          status: result?.error ? 'error' as const : 'success' as const,
          value: result?.value,
          error: result?.error,
        }
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : t('aiTable.aiField.generateFailed')
      setRequestError(message)
      setPreviewRows(targets.map((row) => ({ rowKey: config.rowKey(row), status: 'error', error: message })))
    } finally {
      setRunning(false)
    }
  }

  async function save() {
    if (!canSave || saving) return
    setSaving(true)
    setRequestError(null)
    try {
      if (canRun) {
        await createAIField(definition)
        resetForm()
      } else {
        saveView()
      }
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : t('aiTable.aiField.generateFailed'))
    } finally {
      setSaving(false)
    }
  }

  function insertField(id: string) {
    const field = readableFields.find((item) => item.fieldId === id)
    if (field) promptEditorRef.current?.insertField({ fieldId: field.fieldId, label: field.label })
    setFieldPickerOpen(false)
  }

  function resetForm() {
    setFieldId(generateId('aiField'))
    setName('')
    setOutputType('tag')
    setPrompt('')
    setAutoUpdate(false)
    setAllowEmptyReferencedValues(false)
    setPreviewRows([])
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-popover">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold"><Bot className="size-4 text-primary" />{t('aiTable.aiField.title')}</div>
        <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={t('aiTable.aiField.close')} onClick={() => setActivePanel(null)}><X className="size-4" /></Button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {requestError ? <p role="alert" className="text-sm text-status-rejected">{requestError}</p> : null}
        {state.draftView.aiFields.length ? (
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="mb-2 text-xs font-medium text-description">{t('aiTable.aiField.createdFields')}</p>
            <div className="space-y-1.5">
              {state.draftView.aiFields.map((field) => (
                <div key={field.fieldId} className="flex items-center justify-between rounded-md bg-card px-2 py-1.5">
                  <div className="flex items-center gap-2"><Badge variant="blue">{outputTypeLabel(field.outputType)}</Badge><span className="text-xs font-medium">{field.name}</span></div>
                  <div className="flex items-center">
                    <Button type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={t('aiTable.aiField.rerun', { name: field.name })} onClick={() => void regenerateAIFieldValues(field.fieldId).catch((error: unknown) => setRequestError(error instanceof Error ? error.message : t('aiTable.aiField.generateFailed')))}><RefreshCw className="size-3.5" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={t('aiTable.aiField.delete', { name: field.name })} onClick={() => removeAIField(field.fieldId)}><Trash2 className="size-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-xs font-medium">{t('aiTable.aiField.fieldName')} <span className="text-status-rejected">*</span></label>
          <Input value={name} maxLength={50} onChange={(event) => setName(event.target.value)} placeholder={t('aiTable.aiField.fieldNamePlaceholder')} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium">{t('aiTable.aiField.outputType')} <span className="text-status-rejected">*</span></label>
          <Select value={outputType} onValueChange={(value) => setOutputType(value as AITableAIFieldOutputType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="text">{t('aiTable.aiField.outputText')}</SelectItem><SelectItem value="number">{t('aiTable.aiField.outputNumber')}</SelectItem><SelectItem value="tag">{t('aiTable.aiField.outputTag')}</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium">{t('aiTable.aiField.prompt')} <span className="text-status-rejected">*</span></label>
          <div className="rounded-lg border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
            <AIPromptTokenEditor
              ref={promptEditorRef}
              value={prompt}
              fields={readableFields}
              onChange={setPrompt}
              placeholder={t('aiTable.aiField.promptPlaceholder')}
            />
            <div className="flex flex-wrap items-center gap-1.5 border-t px-2 py-2">
              <Popover open={fieldPickerOpen} onOpenChange={setFieldPickerOpen}>
                <PopoverTrigger asChild><Button type="button" variant="ghost" size="sm" className="ml-auto h-7 gap-1 text-xs"><Plus className="size-3.5" />{t('aiTable.aiField.insertField')}</Button></PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-1">
                  {readableFields.map((field) => <button key={field.fieldId} type="button" className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs hover:bg-muted" onClick={() => insertField(field.fieldId)}><span>{field.label}</span><span className="text-[10px] text-muted-foreground">{field.source === 'derived' ? t('aiTable.aiField.sourceDerived') : field.source === 'ai' ? t('aiTable.aiField.sourceAi') : t('aiTable.aiField.sourceBusiness')}</span></button>)}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium">{t('aiTable.aiField.generationSettings')}</p>
          <TooltipProvider>
            <div className="space-y-3 rounded-lg border bg-card px-3 py-3">
              <GenerationSetting
                id="ai-field-auto-update"
                label={t('aiTable.aiField.autoUpdate')}
                tooltip={t('aiTable.aiField.autoUpdateTooltip')}
                checked={autoUpdate}
                onCheckedChange={setAutoUpdate}
              />
              <GenerationSetting
                id="ai-field-allow-empty-references"
                label={t('aiTable.aiField.allowEmptyReferences')}
                tooltip={t('aiTable.aiField.allowEmptyReferencesTooltip')}
                checked={allowEmptyReferencedValues}
                onCheckedChange={setAllowEmptyReferencedValues}
              />
            </div>
          </TooltipProvider>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium">{t('aiTable.aiField.preview')}</p>
            {previewRows.length ? <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs" disabled={running} onClick={() => void preview()}><RefreshCw className="size-3.5" />{t('aiTable.aiField.repreview')}</Button> : null}
          </div>
          <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1.2fr_1fr] bg-muted/40 px-3 py-2 text-[11px] font-medium text-description"><span>{t('aiTable.aiField.record')}</span><span>{t('aiTable.aiField.previewColumn', { name: name || t('aiTable.aiField.title') })}</span></div>
            {(previewRows.length ? previewRows : filteredRows.slice(0, 5).map((row) => ({ rowKey: config.rowKey(row), status: 'waiting' as const }))).map((row) => (
              <div key={row.rowKey} className="grid grid-cols-[1.2fr_1fr] border-t px-3 py-2 text-xs"><span className="truncate font-mono text-description">{row.rowKey}</span><PreviewValue row={row} /></div>
            ))}
            {!filteredRows.length ? <p className="px-3 py-4 text-center text-xs text-muted-foreground">{t('aiTable.aiField.noRecords')}</p> : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
        <Button type="button" variant="outline" size="sm" onClick={() => setActivePanel(null)}>{t('aiTable.aiField.cancel')}</Button>
        <Button type="button" variant="outline" size="sm" disabled={!canRun || running} onClick={() => void preview()}>{running ? <Loader2 className="size-4 animate-spin" /> : null}{t('aiTable.aiField.runPreview')}</Button>
        <Button type="button" size="sm" disabled={!canSave || saving} onClick={() => void save()}>{saving ? <Loader2 className="size-4 animate-spin" /> : null}{t('aiTable.aiField.save')}</Button>
      </div>
    </div>
  )
}

function PreviewValue({ row }: { row: PreviewRow }) {
  const { t } = useTranslation()
  if (row.status === 'running') return <span className="flex items-center gap-1 text-primary"><Loader2 className="size-3.5 animate-spin" />{t('aiTable.aiField.generating')}</span>
  if (row.status === 'success') return <span className="flex items-center gap-1"><CheckCircle2 className="size-3.5 text-status-approved" />{String(row.value ?? '—')}</span>
  if (row.status === 'error') return <span className="text-status-rejected">{row.error ?? t('aiTable.aiField.generateFailed')}</span>
  if (row.status === 'skipped') return <span className="text-muted-foreground">{t('aiTable.aiField.skipped')}</span>
  return <span className="text-muted-foreground">{t('aiTable.aiField.waiting')}</span>
}

function GenerationSetting({
  id,
  label,
  tooltip,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  tooltip: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
      <label htmlFor={id} className="cursor-pointer text-sm font-medium">{label}</label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="text-muted-foreground transition-colors hover:text-foreground" aria-label={`${label}${t('aiTable.aiField.tooltipSuffix')}`}>
            <HelpCircle className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6} className="max-w-64 text-xs leading-5">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function outputTypeLabel(type: AITableAIFieldOutputType) {
  return type === 'tag' ? i18n.t('aiTable.aiField.outputTag') : type === 'number' ? i18n.t('aiTable.aiField.outputNumber') : i18n.t('aiTable.aiField.outputText')
}

function getReferencedFieldIds(prompt: string) {
  return [...new Set(Array.from(prompt.matchAll(/\{\{([^}]+)\}\}/g), (match) => match[1]))]
}
