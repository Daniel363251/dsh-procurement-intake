const React = require('react')
const { DayPicker } = require('react-day-picker')
const { format } = require('date-fns')
const { zhCN } = require('date-fns/locale')
const h = React.createElement

function text(value) { return value == null ? '' : String(value).trim() }

function keywords(value) { return value.split(/[\s,，、;；|]+/).map(word => word.trim()).filter(Boolean) }
function display(value) { return value ? String(value) : '—' }
function uniqueOrderItemValues(row, key) { return [...new Set((row.items || []).map(item => item[key]).filter(value => value != null && value !== '').map(String))].join('、') }
function sumOrderItemValues(row, key) { return (row.items || []).reduce((sum, item) => sum + (Number(item[key]) || 0), 0) }
function qty(row) { return [row.quantity, row.unit].filter(Boolean).join(' ') || '—' }
function meta(label, value) { return h('span', { key: label }, h('b', null, `${label}：`), display(value)) }
function lineCard(row, t, selected, onSelect, context = false) {
  const reviewText = row.reviewReason === 'duplicateIdentity' ? t('duplicateIdentity') : row.reviewReason === 'missing:requisitionNo' ? `${t('requisitionNo')}缺失` : row.reviewReason === 'missing:materialName' ? `${t('material')}缺失` : row.reviewReason
  return h('article', { className: `pi-line${context ? ' pi-line--context' : ''}`, key: row.id },
    h('div', { className: 'pi-line-top' }, !context && h('input', { className: 'pi-check', type: 'checkbox', checked: selected, 'aria-label': `${t('select')} ${row.materialName || row.requisitionNo}`, onChange: event => onSelect(event.target.checked) }),
      h('div', { className: 'pi-line-copy' }, h('p', { className: 'pi-material' }, row.materialName || t('material')),
        h('div', { className: 'pi-badges' }, row.needsReview && h('span', { className: 'pi-badge pi-badge--warn', title: reviewText }, t('review')), row.purchaseOrderNo && h('span', { className: 'pi-badge' }, `订单 ${row.purchaseOrderNo}`), row.isMine && h('span', { className: 'pi-badge pi-badge--ok' }, t('claimed'))),
        h('div', { className: 'pi-meta' }, meta(t('requisitionNo'), row.requisitionNo), meta(t('lineNo'), row.lineNo), meta('编码', row.materialCode), meta(t('spec'), [row.specification, row.model].filter(Boolean).join(' / ')), meta(t('quantity'), qty(row)), meta(t('expectedDate'), row.demandDate), row.remainingQuantity ? meta('未到货', row.remainingQuantity) : null, row.supplier ? meta('供应商', row.supplier) : null))))
}
function errorText(message, t) { if (message === 'noSheets') return t('noSheets'); if (message === 'noRows') return t('noRows'); if (message.startsWith('noHeader:')) return t('noHeader').replace('{name}', message.slice('noHeader:'.length)); return t('fileReadError') }
function formatDateTime(value) { if (!value) return ''; const date = new Date(value); if (Number.isNaN(date.getTime())) return ''; const pad = number => String(number).padStart(2, '0'); return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}` }
function detailValue(label, value) { return h('div', { className: 'pi-detail-value' }, h('span', null, label), h('strong', null, value == null || value === '' ? '—' : (typeof value === 'string' || typeof value === 'number' ? String(value) : value))) }
function cell(value, className) { const string = value ? String(value) : ''; return h('span', { className: `pi-cell${className ? ' ' + className : ''}`, title: string || undefined }, display(string)) }
function etaValue(row) { const value = text(row.expectedShipAt || row.buyerEtaFromFile); return value ? h('span', { className: 'pi-eta-chip', title: value }, value) : h('span', { className: 'pi-cell pi-cell--muted' }, '—') }
function orderStatusBadge(row) { const status = row.orderStatus || ''; if (!status) return h('span', { className: 'pi-cell pi-cell--muted' }, '—'); const variant = status === '已通知供应商' ? 'pi-badge--ok' : status === '取消了采购订单' ? 'pi-badge--danger' : status === '待通知供应商' ? 'pi-badge--warn' : 'pi-badge--neutral'; return h('span', { className: `pi-badge ${variant}` }, status) }
const CALENDAR_ICON = h('svg', { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', width: 16, height: 16 }, h('rect', { x: 3, y: 5, width: 18, height: 16, rx: 2 }), h('path', { d: 'M16 3v4M8 3v4M3 10h18' }))
const TRASH_ICON = h('svg', { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', width: 16, height: 16 }, h('path', { d: 'M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3' }))
const PLUS_ICON = h('svg', { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', width: 16, height: 16 }, h('path', { d: 'M12 5v14M5 12h14' }))
function DatePicker({ value, onValueChange, placeholder = '选择日期', disabled, 'aria-label': ariaLabel }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (!open) return
    const onDoc = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const label = value ? format(value, 'yyyy年M月d日', { locale: zhCN }) : placeholder
  return h('div', { ref, className: 'cn-date-picker' },
    h('button', { type: 'button', className: 'pi-button pi-button--small cn-date-picker-trigger', disabled, 'aria-label': ariaLabel || placeholder, onClick: () => setOpen(prev => !prev) },
      CALENDAR_ICON, value ? label : h('span', { className: 'cn-date-picker-placeholder' }, placeholder)),
    open && h('div', { className: 'cn-date-picker-popup' },
      h(DayPicker, { mode: 'single', selected: value, onSelect: (date) => { onValueChange?.(date); if (date) setOpen(false) }, locale: zhCN, showOutsideDays: true })))
}


module.exports = {
  keywords, display, uniqueOrderItemValues, sumOrderItemValues, qty, meta, lineCard,
  errorText, formatDateTime, detailValue, cell, etaValue, orderStatusBadge,
  CALENDAR_ICON, TRASH_ICON, PLUS_ICON, DatePicker,
}
