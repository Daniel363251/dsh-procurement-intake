import { z } from 'zod'
import { createTypertRemoteInfo } from '@deepseek-ai/dsh-typert-protocol/remote-info'

const param = (schema) => [{
  name: 'request',
  source: 'json',
  codec: { mode: 'strict', typeSymbol: 'request', create: () => schema },
}]

const looseResult = () => ({ mode: 'strict', typeSymbol: 'result', create: () => z.unknown() })
const sortRule = z.object({ fieldId: z.string(), direction: z.enum(['asc', 'desc']) })
const filterRule = z.object({
  id: z.string(),
  fieldId: z.string(),
  operator: z.enum([
    'equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'notEmpty',
    'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between',
    'isToday', 'isPast', 'isFuture', 'withinPastDays', 'withinNextDays',
  ]),
  value: z.unknown().optional(),
  conjunction: z.enum(['and', 'or']),
})

export const $remote = createTypertRemoteInfo({
  package: '@hilda-biz/dsh-procurement-intake',
  methods: {
    'procurement/list': {
      service: 'procurement',
      description: 'List a page of procurement requisition lines by status (pending / mine / all).',
      invocation: { kind: 'direct' },
      parameters: param(z.object({
        status: z.enum(['pending', 'mine', 'all']),
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(500).default(10),
        sort: z.union([sortRule, z.array(sortRule)]).optional(),
        filters: z.array(filterRule).optional(),
        keywords: z.string().optional(),
      })),
      result: looseResult(),
    },
    'procurement/listPurchaseOrders': {
      service: 'procurement',
      description: 'List a filtered and sorted page of imported purchase orders.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(10),
        sort: z.union([sortRule, z.array(sortRule)]).optional(),
        filters: z.array(filterRule).optional(),
      })),
      result: looseResult(),
    },
    'procurement/importPurchaseOrders': {
      service: 'procurement',
      description: 'Persist browser-parsed purchase orders from Excel files.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ orders: z.array(z.unknown()).min(1) })),
      result: looseResult(),
    },
    'procurement/deletePurchaseOrders': {
      service: 'procurement',
      description: 'Delete selected imported purchase orders and their stored details.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ ids: z.array(z.string()).min(1) })),
      result: looseResult(),
    },
    'procurement/cancelPurchaseOrders': {
      service: 'procurement',
      description: 'Mark selected purchase orders as cancelled without deleting them and synchronize linked requisition status.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ ids: z.array(z.string()).min(1) })),
      result: looseResult(),
    },
    'procurement/notifyPurchaseOrders': {
      service: 'procurement',
      description: 'Mark selected purchase orders as notified to suppliers and synchronize linked requisition status.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ ids: z.array(z.string()).min(1) })),
      result: looseResult(),
    },
    'procurement/syncOwnedPurchaseOrderNumbers': {
      service: 'procurement',
      description: 'Fill missing purchase order numbers on owned requisition lines from locally stored purchase order records.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({})),
      result: looseResult(),
    },
    'procurement/aiGenerate': {
      service: 'procurement',
      description: 'Generate structured AI results (filters / colors / field-preview) from a natural-language instruction.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({
        operation: z.enum(['filters', 'colors', 'field-preview']),
        payload: z.unknown(),
        sessionId: z.string().optional(),
      })),
      result: looseResult(),
    },
    'procurement/listModelOptions': {
      service: 'procurement',
      description: 'List available models and reasoning efforts for AI generation.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({})),
      result: looseResult(),
    },
    'procurement/getModelSettings': {
      service: 'procurement',
      description: 'Read the persisted model and reasoning-effort settings.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({})),
      result: looseResult(),
    },
    'procurement/updateModelSettings': {
      service: 'procurement',
      description: 'Persist the chosen model and reasoning effort.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ model: z.string(), reasoningEffort: z.string() })),
      result: looseResult(),
    },
    'procurement/search': {
      service: 'procurement',
      description: 'Search procurement requisition lines by material-name keywords.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ keywords: z.string() })),
      result: looseResult(),
    },
    'procurement/claim': {
      service: 'procurement',
      description: 'Claim selected pending lines as the buyer\'s own requests.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ ids: z.array(z.string()) })),
      result: looseResult(),
    },
    'procurement/updateLine': {
      service: 'procurement',
      description: 'Update follow-up fields of one claimed line.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({
        id: z.string(),
        supplier: z.string().optional(),
        expectedShipAt: z.string().optional(),
        notes: z.string().optional(),
        nextAction: z.string().optional(),
        waitingOn: z.string().optional(),
      })),
      result: looseResult(),
    },
    'procurement/updateSuppliers': {
      service: 'procurement',
      description: 'Batch update the supplier field of selected owned lines.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ ids: z.array(z.string()), supplier: z.string() })),
      result: looseResult(),
    },
    'procurement/importLines': {
      service: 'procurement',
      description: 'Import browser-parsed NC requisition lines into the review pool.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ lines: z.array(z.unknown()), fileName: z.string(), sheetName: z.string() })),
      result: looseResult(),
    },
    'procurement/clearPending': {
      service: 'procurement',
      description: 'Clear all unclaimed pending lines; claimed lines are unaffected.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({})),
      result: looseResult(),
    },
    'procurement/deleteOwned': {
      service: 'procurement',
      description: 'Delete selected owned (claimed) lines.',
      invocation: { kind: 'direct' },
      parameters: param(z.object({ ids: z.array(z.string()) })),
      result: looseResult(),
    },
  },
}, z)
