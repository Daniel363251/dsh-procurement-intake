const React = require('react')
const h = React.createElement

function renderRequisitionDialogs({
  t, detailDialogOverlayRef, detailRow, detailDraft, savingDetail, setDetailRow, setDetailDraft,
  saveDetails, detailValue, copyCell, qty, formatDateTime, shipDialogOpen, setShipDialogOpen,
  mineSelected, shipDate, setShipDate, applyShipToSelected, supplierDialogOpen, savingBatchSupplier,
  setSupplierDialogOpen, batchSupplierDraft, setBatchSupplierDraft, applySupplierToSelected,
}) {
  const detailDialog = detailRow && detailDraft && h('div', { ref: detailDialogOverlayRef, className: 'pi-drawer-overlay', onClick: event => { if (event.target === event.currentTarget && !savingDetail) setDetailRow(null) } },
    h('div', { className: 'pi-drawer-panel pi-detail-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('detailTitle') },
      h('div', { className: 'pi-detail-heading' }, h('div', null, h('h3', { className: 'pi-dialog-title' }, t('detailTitle')), h('p', { className: 'pi-dialog-description' }, `${detailRow.materialName || t('material')} · ${detailRow.requisitionNo || '—'}`)),
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingDetail, onClick: () => setDetailRow(null) }, t('close'))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('detailBasics')),
        h('div', { className: 'pi-detail-grid' },
          detailValue(t('requisitionNo'), copyCell(detailRow.requisitionNo, t('requisitionNo'), true)), detailValue(t('lineNo'), detailRow.lineNo),
          detailValue(t('procurementOrg'), copyCell(detailRow.procurementOrg || detailRow.sourceFields?.['采购组织'] || detailRow.sourceFields?.['未命名列14'], t('procurementOrg'), true)),
          detailValue(t('materialInfo'), copyCell(detailRow.materialName, t('material'), true)), detailValue(t('materialCode'), copyCell(detailRow.materialCode, t('materialCode'), true)),
          detailValue(t('materialCategory'), detailRow.materialCategory),
          detailValue(t('spec'), [detailRow.specification, detailRow.model].filter(Boolean).join(' / ')), detailValue(t('quantity'), qty(detailRow)),
          detailValue(t('remainingQuantity'), detailRow.remainingQuantity), detailValue(t('expectedDate'), detailRow.demandDate),
          detailValue(t('purchaseOrder'), copyCell(detailRow.purchaseOrderNo, t('purchaseOrder'), true)), detailValue(t('orderStatus'), detailRow.orderStatus || t('unmatchedPurchaseOrder')),
          detailValue(t('claimedAt'), formatDateTime(detailRow.confirmedAt)), detailValue(t('sourceFile'), detailRow.sourceFileName),
          detailValue(t('importedAt'), formatDateTime(detailRow.importedAt)))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('followupSection')),
        h('div', { className: 'pi-detail-form' },
          h('label', { className: 'pi-detail-field' }, h('span', null, t('supplier')), h('input', { className: 'pi-input pi-detail-input', type: 'text', value: detailDraft.supplier, disabled: savingDetail, placeholder: t('supplierPlaceholder'), onChange: event => setDetailDraft(current => ({ ...current, supplier: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('expectedShip')), h('input', { className: 'pi-input pi-detail-input', type: 'text', value: detailDraft.expectedShipAt, disabled: savingDetail, placeholder: 'YYYY-MM-DD / 10月10日左右', onChange: event => setDetailDraft(current => ({ ...current, expectedShipAt: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('nextAction')), h('textarea', { className: 'pi-detail-textarea', rows: 2, value: detailDraft.nextAction, disabled: savingDetail, onChange: event => setDetailDraft(current => ({ ...current, nextAction: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('waitingOn')), h('textarea', { className: 'pi-detail-textarea', rows: 2, value: detailDraft.waitingOn, disabled: savingDetail, onChange: event => setDetailDraft(current => ({ ...current, waitingOn: event.target.value })) })),
          h('label', { className: 'pi-detail-field pi-detail-field--wide' }, h('span', null, t('notes')), h('textarea', { className: 'pi-detail-textarea', rows: 3, value: detailDraft.notes, disabled: savingDetail, onChange: event => setDetailDraft(current => ({ ...current, notes: event.target.value })) }))),
        h('div', { className: 'pi-dialog-actions' },
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingDetail, onClick: () => setDetailRow(null) }, t('close')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', style: { width: 'auto' }, disabled: savingDetail, onClick: saveDetails }, savingDetail ? t('saving') : t('saveDetail')))),
      detailRow.activityLog?.length ? h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('activityHistory')),
        h('div', { className: 'pi-detail-history' }, ...[...detailRow.activityLog].slice(-8).reverse().map(item => h('article', { className: 'pi-detail-history-item', key: item.id }, h('strong', null, item.action), h('span', null, formatDateTime(item.createdAt)), h('p', null, item.detail))))) : null));
  const shipDialog = shipDialogOpen && h('div', { className: 'pi-dialog-overlay', onClick: event => { if (event.target === event.currentTarget) setShipDialogOpen(false) } },
    h('div', { className: 'pi-dialog-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': '批量更新发货日期' },
      h('h3', { className: 'pi-dialog-title' }, '批量更新发货日期'),
      h('p', { className: 'pi-dialog-description' }, `为已选择的 ${mineSelected.size} 条采购明细设置预计发货日期。`),
      h('label', { className: 'pi-batch-date-label' }, t('expectedShip'), h(DatePicker, { value: shipDate, onValueChange: setShipDate, 'aria-label': t('expectedShip') })),
      h('div', { className: 'pi-dialog-actions' },
        h('button', { type: 'button', className: 'pi-button pi-button--small', onClick: () => setShipDialogOpen(false) }, '取消'),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', style: { width: 'auto' }, disabled: !shipDate, onClick: applyShipToSelected }, '确认更新'))))

  const supplierDialog = supplierDialogOpen && h('div', { className: 'pi-dialog-overlay', onClick: event => { if (event.target === event.currentTarget && !savingBatchSupplier) setSupplierDialogOpen(false) } },
    h('div', { className: 'pi-dialog-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('batchSupplier') },
      h('h3', { className: 'pi-dialog-title' }, t('batchSupplier')),
      h('p', { className: 'pi-dialog-description' }, t('batchSupplierConfirm').replace('{count}', String(mineSelected.size))),
      h('label', { className: 'pi-detail-field', style: { marginTop: 16 } }, h('span', null, t('supplier')),
        h('input', { className: 'pi-input', type: 'text', value: batchSupplierDraft, autoFocus: true, placeholder: t('supplierPlaceholder'), onChange: event => setBatchSupplierDraft(event.target.value) })),
      h('div', { className: 'pi-dialog-actions' },
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingBatchSupplier, onClick: () => setSupplierDialogOpen(false) }, t('close')),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', style: { width: 'auto' }, disabled: !batchSupplierDraft.trim() || savingBatchSupplier, onClick: applySupplierToSelected }, savingBatchSupplier ? t('saving') : t('batchSupplier')))));

  return { detailDialog, shipDialog, supplierDialog }
}

module.exports = { renderRequisitionDialogs }
