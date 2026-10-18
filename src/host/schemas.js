import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'

const activitySchema = z.object({
  id: z.string(),
  action: z.string(),
  detail: z.string(),
  createdAt: z.string(),
  actor: z.string(),
})

const requisitionLineSchema = z.object({
  id: z.string(),
  identityKey: z.string(),
  sourceRowNumber: z.number(),
  requisitionNo: z.string(),
  procurementOrg: z.string().default(''),
  lineNo: z.string(),
  materialCode: z.string(),
  materialName: z.string(),
  materialCategory: z.string().default(''),
  specification: z.string(),
  model: z.string(),
  unit: z.string(),
  quantity: z.string(),
  demandDate: z.string(),
  suggestedOrderDate: z.string(),
  remainingQuantity: z.string(),
  purchaseOrderNo: z.string(),
  supplier: z.string(),
  sourceFields: z.record(z.string(), z.string()),
  buyerEtaFromFile: z.string(),
  expectedShipAt: z.string(),
  isMine: z.boolean(),
  confirmedAt: z.string().nullable(),
  confirmationBatchId: z.string().nullable(),
  notes: z.string(),
  needsReview: z.boolean(),
  reviewReason: z.string(),
  sourceFileName: z.string(),
  importedAt: z.string(),
  orderStatus: z.string(),
  nextAction: z.string(),
  waitingOn: z.string(),
  activityLog: z.array(activitySchema),
})

const purchaseOrderItemSchema = z.object({
  sequence: z.string().default(''), name: z.string().default(''), specification: z.string().default(''),
  quantity: z.number().nullable().default(null), unit: z.string().default(''),
  taxInclusiveUnitPrice: z.number().nullable().default(null), taxExclusiveUnitPrice: z.number().nullable().default(null),
  amount: z.number().nullable().default(null),
  requisitionNo: z.string().default(''), lineNo: z.string().default(''), materialCode: z.string().default(''),
  materialCategory: z.string().default(''), inventoryOrg: z.string().default(''), requisitionType: z.string().default(''),
  preparer: z.string().default(''), procurementOrg: z.string().default(''), lineRemark: z.string().default(''),
  sourceDocumentNo: z.string().default(''), sourceDocumentLineNo: z.string().default(''),
  requisitionQuantity: z.number().nullable().default(null), orderedQuantity: z.number().nullable().default(null),
  demandDate: z.string().default(''), suggestedOrderDate: z.string().default(''),
  expectedArrivalDate: z.string().default(''), arrivalDate: z.string().default(''),
  receivedQuantity: z.number().nullable().default(null), returnedQuantity: z.number().nullable().default(null),
  remainingQuantity: z.number().nullable().default(null), stockInDate: z.string().default(''),
  customer: z.string().default(''), stockInQuantity: z.number().nullable().default(null),
  returnedStockQuantity: z.number().nullable().default(null), replenishmentQuantity: z.number().nullable().default(null),
  unexecutedCloseQuantity: z.number().nullable().default(null), requisitionLineClosed: z.string().default(''),
  procurementOfficer: z.string().default(''), procurementDepartment: z.string().default(''), project: z.string().default(''),
  deliveryAddress: z.string().default(''),
})
const purchaseOrderClauseSchema = z.object({ section: z.string(), text: z.string() })
const purchaseOrderSchema = z.object({
  id: z.string(), orderNo: z.string(), orderDate: z.string().default(''), buyer: z.string().default(''), supplier: z.string().default(''),
  purchaseOrderStatus: z.enum(['待通知供应商', '已通知供应商', '取消了采购订单']).default('待通知供应商'),
  inventoryOrg: z.string().default(''), requisitionType: z.string().default(''), preparer: z.string().default(''),
  requisitionNos: z.array(z.string()).default([]), procurementOrg: z.string().default(''),
  procurementOfficer: z.string().default(''), procurementDepartment: z.string().default(''), project: z.string().default(''),
  taxInclusiveTotal: z.number().nullable().default(null), taxExclusiveTotal: z.number().nullable().default(null), taxRate: z.string().default(''),
  items: z.array(purchaseOrderItemSchema).default([]), deliveryAddress: z.string().default(''), recipient: z.string().default(''),
  recipientPhone: z.string().default(''), deliveryTime: z.string().default(''), paymentTerms: z.array(z.string()).default([]),
  otherTerms: z.array(z.string()).default([]), clauses: z.array(purchaseOrderClauseSchema).default([]),
  activityLog: z.array(activitySchema).default([]),
  sourceFileName: z.string().default(''), importedAt: z.string(),
})

const latestImportMetaSchema = z.object({
  fileName: z.string(),
  sheetName: z.string(),
  importedAt: z.string(),
  importedCount: z.number(),
  updatedCount: z.number(),
}).nullable()

const modelSettingsSchema = z.object({
  model: z.string(),
  reasoningEffort: z.string(),
})

const procurementMetaSchema = z.object({
  latestImport: latestImportMetaSchema,
  modelSettings: modelSettingsSchema.optional(),
  workspaceReadTodoIds: z.array(z.string()).default([]),
})

const masterStatusSchema = z.enum(['enabled', 'disabled']).default('enabled')
const masterTimestamps = { createdAt: z.string(), updatedAt: z.string() }
const supplierMasterSchema = z.object({ id: z.string(), name: z.string(), status: masterStatusSchema, ...masterTimestamps })
const materialMasterSchema = z.object({
  id: z.string(), code: z.string().default(''), name: z.string(), category: z.string().default(''),
  specification: z.string().default(''), unit: z.string().default(''), status: masterStatusSchema, ...masterTimestamps,
})
const materialCategoryMasterSchema = z.object({ id: z.string(), name: z.string(), status: masterStatusSchema, ...masterTimestamps })

const procurementDomain = defineDomain({
  name: 'procurement',
  version: 1,
  layout: 'single',
  tables: {
    requisitions: domainTable(requisitionLineSchema),
    purchase_orders: domainTable(purchaseOrderSchema),
    suppliers: domainTable(supplierMasterSchema),
    materials: domainTable(materialMasterSchema),
    material_categories: domainTable(materialCategoryMasterSchema),
  },
  global: {
    schema: procurementMetaSchema,
    initial: { latestImport: null, workspaceReadTodoIds: [] },
  },
})


export {
  activitySchema, requisitionLineSchema, purchaseOrderItemSchema, purchaseOrderClauseSchema,
  purchaseOrderSchema, latestImportMetaSchema, modelSettingsSchema, procurementMetaSchema,
  masterStatusSchema, supplierMasterSchema, materialMasterSchema, materialCategoryMasterSchema,
  procurementDomain,
}
