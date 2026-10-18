const PENDING_QUERY_FIELD_IDS = ['materialName', 'materialCode', 'materialCategory', 'specification', 'requisitionNo', 'lineNo', 'quantity', 'demandDate', 'review']
const MINE_QUERY_FIELD_IDS = ['materialName', 'materialCode', 'materialCategory', 'specification', 'requisitionNo', 'procurementOrg', 'lineNo', 'quantity', 'remainingQuantity', 'purchaseOrderNo', 'supplier', 'orderStatus', 'demandDate', 'expectedShipAt', 'notes', 'confirmedAt']
const MINE_COLUMN_SETTINGS_KEY = 'hilda:dsh-procurement-intake:procurement.owned-lines:columns:v2'

module.exports = { PENDING_QUERY_FIELD_IDS, MINE_QUERY_FIELD_IDS, MINE_COLUMN_SETTINGS_KEY }
