const React = require('react')
const h = React.createElement

function renderRequisitionImportViews({
  t, h, store, parsing, importing, dragActive, setDragActive, fileInputRef, fileName,
  sheets, sheetIndex, setSheetIndex, sheet, chooseFile, doImport, lineCard, query, setQuery,
  keywordRef, candidates, selectedCount, requisitionCount, selected, clearPending, claim,
}) {
  const uploadSection = h('section', { className: 'pi-card' },
    h('div', { className: 'pi-inline' }, h('h2', { className: 'pi-section-title' }, t('chooseFile')), parsing && h('span', { className: 'pi-badge' }, t('parsing'))),
    h('p', { className: 'pi-help' }, t('previewHelp')),
    h('div', { className: `pi-card pi-upload${dragActive ? ' pi-upload--active' : ''}`, style: { marginTop: 9 }, onDragEnter: event => { event.preventDefault(); setDragActive(true) }, onDragOver: event => event.preventDefault(), onDragLeave: event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragActive(false) }, onDrop: event => { event.preventDefault(); setDragActive(false); chooseFile(event.dataTransfer.files[0]) } },
      h('span', { className: 'pi-upload-name' }, parsing ? t('parsing') : fileName || t('drop')), h('span', { className: 'pi-help', style: { margin: 0 } }, t('fileHelp')),
      h('button', { type: 'button', className: 'pi-button', disabled: parsing, onClick: () => fileInputRef.current && fileInputRef.current.click() }, t('select')),
      h('input', { ref: fileInputRef, className: 'pi-hidden-input', type: 'file', tabIndex: -1, 'aria-label': t('chooseFile'), accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', disabled: parsing, onChange: event => { chooseFile(event.currentTarget.files && event.currentTarget.files[0]); event.currentTarget.value = '' } })),
    store.latestImport && h('p', { className: 'pi-latest' }, `${t('latestImport')}：${store.latestImport.fileName} · ${store.latestImport.sheetName} · ${new Date(store.latestImport.importedAt).toLocaleString()}`))

  const previewSection = sheet && h('section', { className: 'pi-card' },
    h('div', { className: 'pi-inline' }, h('h2', { className: 'pi-section-title' }, `${t('importPreview')} · ${sheet.lines.length}`),
      sheets.length > 1 ? h('label', { className: 'pi-sheet-select' }, `${t('chooseSheet')}：`, h('select', { className: 'pi-select', value: sheetIndex, onChange: event => setSheetIndex(Number(event.target.value)) }, ...sheets.map((item, index) => h('option', { key: item.name, value: index }, item.name)))) : h('span', { className: 'pi-badge' }, sheet.name)),
    h('p', { className: 'pi-help' }, `${sheet.headers.length} ${t('columnsRecognized')} · ${sheet.warningCount} ${t('reviewCount')}`),
    h('div', { className: 'pi-stats' }, ...[[sheet.lines.length, t('lines')], [new Set(sheet.lines.map(row => row.requisitionNo).filter(Boolean)).size, t('requisitionNo')], [sheet.warningCount, t('reviewCount')]].map(([value, label]) => h('div', { className: 'pi-stat', key: label }, h('strong', { className: sheet.warningCount && label === t('reviewCount') ? 'pi-warn' : '' }, value), h('span', null, label)))),
    sheet.warningCount > 0 && h('p', { className: 'pi-help pi-warn', role: 'status' }, t('reviewHelp')),
    h('div', { className: 'pi-preview-list' }, ...sheet.lines.slice(0, 5).map(row => lineCard(row, t, false, null))),
    sheet.lines.length > 5 && h('p', { className: 'pi-help' }, `预览前 5 条；确认后导入全部 ${sheet.lines.length} 条。`),
    h('button', { type: 'button', className: 'pi-button pi-button--primary', style: { marginTop: 10 }, disabled: parsing || importing, 'aria-busy': importing, onClick: doImport }, importing && h('span', { className: 'pi-spinner', 'aria-hidden': 'true' }), importing ? t('importing') : `${t('importPool')} · ${sheet.lines.length}`))

  const searchSection = h('section', { className: 'pi-card' },
    h('div', { className: 'pi-inline' }, h('h2', { className: 'pi-section-title' }, t('candidates')), h('span', { className: 'pi-badge' }, `${store.pendingTotal} · ${requisitionCount} ${t('orders')}`)),
    h('p', { className: 'pi-help' }, t('searchHelp')),
    h('label', { style: { display: 'block', marginTop: 9 } }, h('span', { className: 'pi-search-label' }, t('keywordLabel')), h('input', { className: 'pi-input', value: query, onChange: event => { keywordRef.current = event.target.value; setQuery(event.target.value) }, placeholder: t('keywordPlaceholder'), type: 'search' })),
    store.pendingTotal > 0 && h('button', { type: 'button', className: 'pi-button pi-button--danger', style: { marginTop: 7 }, onClick: clearPending }, `${t('clearPending')}（${store.pendingTotal}）`),
    h('p', { className: 'pi-resultline', 'aria-live': 'polite' }, h('strong', null, store.pendingFilteredTotal), ` ${t('matches')} · ${store.pendingFilteredRequisitionCount} ${t('orders')}`))

  const batchSection = (candidates.length > 0 || selectedCount > 0) && h('section', { className: 'pi-batch', 'aria-label': t('claimSelected') },
    h('div', { className: 'pi-inline', style: { marginBottom: 8 } },
      h('span', { className: 'pi-batch-count' }, `${t('selected')} ${selectedCount} / ${store.pendingTotal}`)),
    h('button', { type: 'button', className: 'pi-button pi-button--primary', disabled: !selectedCount, onClick: claim }, `${t('claimSelected')} · ${selectedCount}`))

  return { uploadSection, previewSection, searchSection, batchSection }
}

module.exports = { renderRequisitionImportViews }
