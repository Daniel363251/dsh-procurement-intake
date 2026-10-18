const React = require('react')
const XLSX = require('@e965/xlsx')
const { TYPERT_REMOTE } = require('./typert.remote-client.js')
const { Button: HildaButton } = require('./vendor/hilda-ui/components/Button.tsx')
const { Select: HildaSelect, SelectTrigger: HildaSelectTrigger, SelectValue: HildaSelectValue, SelectContent: HildaSelectContent, SelectItem: HildaSelectItem } = require('./vendor/hilda-ui/components/Select.tsx')
const { DayPicker } = require('react-day-picker')
const { DropdownMenu } = require('radix-ui')
const { Send, RefreshCw, Copy, Check, Building2, Package, Tags, LayoutDashboard, ClipboardList, PackageCheck, TriangleAlert, Settings2, Database, Unlink, Truck, ListTodo, Activity, ArrowUpRight } = require('lucide-react')
const { format } = require('date-fns')
const { zhCN } = require('date-fns/locale')
const { AIDataTable, defineAITable } = require('@enterprise/ai-table')
const { ChartContainer, ChartTooltipContent } = require('./vendor/hilda-ui/components/Chart.tsx')
const { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } = require('recharts')
const h = React.createElement
const EMPTY_STATE_IMAGE = __EMPTY_STATE_IMAGE__
const PLUGIN_ICON = __PLUGIN_ICON__
function PluginGuideIcon({ size = 24, className }) {
  return h('img', { src: PLUGIN_ICON, alt: '', width: size, height: size, className, style: { objectFit: 'contain', borderRadius: 4 } })
}
function emptyStateContent(title, description, { compact = false, action = null } = {}) {
  return h('div', { className: `pi-empty-state-content${compact ? ' is-compact' : ''}` },
    h('img', { className: 'pi-empty-state-illustration', src: EMPTY_STATE_IMAGE, alt: '' }),
    h('div', { className: 'pi-empty-state-copy' },
      h('strong', null, title),
      description ? h('p', null, description) : null,
      action))
}
const aiTableCSS = __AI_TABLE_CSS__
const hildaUiCSS = __HILDA_UI_CSS__ + '.pi-badge--danger{background:var(--pc-color-danger-bg);color:var(--pc-color-danger-text)}.pi-order-menu-trigger{display:inline-grid;place-items:center;width:32px;height:32px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-md);background:var(--pc-color-surface,#fff);color:var(--pc-color-text-secondary,#536176);font-size:20px;line-height:1;cursor:pointer}.pi-order-menu-trigger:hover{background:var(--pc-color-neutral-bg,#f1f4f8);color:var(--pc-color-text,#172033)}.pi-order-action-menu{z-index:100;min-width:148px;padding:4px;border:1px solid var(--pc-color-border,#d9dee7);border-radius:var(--pc-radius-md,8px);background:var(--pc-color-surface,#fff);box-shadow:var(--pc-shadow-menu,0 8px 24px rgba(17,25,45,.16));color:var(--pc-color-text,#172033)}.pi-order-action-menu-item{display:flex;align-items:center;min-height:32px;padding:0 9px;border-radius:var(--pc-radius-sm,4px);font-size:12px;outline:none;cursor:pointer}.pi-order-action-menu-item[data-highlighted]{background:var(--pc-color-neutral-bg,#f1f4f8)}.pi-order-action-menu-item--danger{color:var(--pc-color-danger-text,#b42318)}.pi-order-action-menu-item[data-disabled]{opacity:.45;pointer-events:none}.pi-order-batch-notify{background:var(--pc-color-success,#34c759);border-color:var(--pc-color-success,#34c759);color:var(--pc-color-primary-foreground,#fff)}.pi-order-batch-notify:hover:not(:disabled){filter:brightness(.93)}.pi-button.pi-order-batch-notify:hover:not(:disabled){background:var(--pc-color-success,#34c759);border-color:var(--pc-color-success,#34c759);color:var(--pc-color-primary-foreground,#fff);filter:brightness(.93)}.pi-order-detail-heading-actions{display:flex;align-items:center;gap:6px;flex:0 0 auto;flex-wrap:nowrap;justify-content:flex-end;min-width:0}.pi-order-detail-heading-actions .pi-button{flex:none;white-space:nowrap}.pi-drawer-panel.pi-order-detail-dialog .pi-detail-heading{box-sizing:border-box;width:calc(100% + 48px);margin-left:-24px;margin-right:-24px;padding-left:24px;padding-right:24px;align-items:center}.pi-order-detail-dialog .pi-detail-heading>div:first-child{flex:1 1 0;min-width:0}.pi-order-detail-dialog .pi-detail-copy-cell{color:var(--pc-color-text)}'
const copyCellCSS = '.pi-copy-cell{display:flex;align-items:center;gap:6px;width:100%;min-width:0;padding:0;border:0;background:transparent;color:color-mix(in srgb,var(--pc-color-info) 34%,var(--pc-color-text-secondary));font:inherit;text-align:left;cursor:pointer}.pi-copy-cell:hover{color:color-mix(in srgb,var(--pc-color-info) 52%,var(--pc-color-text-secondary))}.pi-copy-cell:hover .pi-copy-cell-text{text-decoration:underline;text-underline-offset:2px}.pi-copy-cell:focus-visible{border-radius:3px;outline:2px solid var(--pc-color-focus);outline-offset:2px}.pi-copy-cell-icon{flex:0 0 14px;opacity:.8}.pi-copy-cell-text{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pi-detail-copy-cell{width:auto;max-width:100%;font-size:12px;font-weight:550}.pi-order-detail-items .pi-copy-cell{max-width:100%}'
const masterDataCSS = '.pi-master-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:14px}.pi-master-tile{display:flex;min-height:112px;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;padding:16px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface-raised);color:var(--pc-color-text);text-align:left;cursor:pointer;transition:background-color 120ms ease-out,border-color 120ms ease-out,box-shadow 120ms ease-out}.pi-master-tile:hover{background:var(--pc-color-surface);border-color:var(--pc-color-border-strong);box-shadow:var(--pc-shadow-menu)}.pi-master-tile strong{font-size:14px;font-weight:650}.pi-master-tile>span:last-child{color:var(--pc-color-text-muted);font-size:11px}.pi-master-tile-icon{display:grid;place-items:center;width:32px;height:32px;border:1px solid var(--pc-color-border);border-radius:8px;color:var(--pc-color-text-secondary)}.pi-master-tile-icon svg{width:17px;height:17px;stroke-width:1.8}.pi-master-subnav{display:flex;align-items:center;gap:6px;margin:12px 0;padding:3px;border:1px solid var(--pc-color-border);border-radius:9px;background:var(--pc-color-surface-raised)}.pi-master-subnav-item,.pi-master-back{min-height:30px;padding:5px 11px;border:0;border-radius:6px;background:transparent;color:var(--pc-color-text-secondary);font:inherit;font-size:12px;cursor:pointer}.pi-master-subnav-item.is-active{background:var(--pc-color-surface);color:var(--pc-color-text);font-weight:600;box-shadow:0 1px 3px rgb(17 25 45 / 10%)}.pi-master-back{font-size:18px;line-height:1}.pi-master-form{display:flex;flex-direction:column;gap:12px;margin:12px 0;padding:14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-md);background:var(--pc-color-surface-raised)}.pi-master-form-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.pi-master-form-actions{display:flex;justify-content:flex-end;gap:8px}.pi-master-form .pi-detail-field{min-width:0}.pi-master-form .pi-input{width:100%}'
const hoverTooltipCSS = '.ai-table-plugin td[data-tooltip]:not(.sticky){position:relative}.ai-table-plugin td[data-tooltip].is-truncated-tooltip:hover{overflow:visible!important;z-index:70}.ai-table-plugin td[data-tooltip]::after{position:absolute;top:calc(100% + 4px);left:8px;z-index:1000;max-width:min(420px,70vw);width:max-content;padding:6px 8px;border:1px solid rgba(255,255,255,.12);border-radius:6px;background:#171717;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.22);font:12px/1.45 var(--pc-font-sans);white-space:normal;overflow-wrap:anywhere;pointer-events:none;content:attr(data-tooltip);opacity:0}.ai-table-plugin td[data-tooltip].is-truncated-tooltip:hover::after{animation:pi-ai-tooltip-in .1s ease-out .12s forwards}@keyframes pi-ai-tooltip-in{to{opacity:1}}'
const tableStickyCSS = '.pc-intake .pi-card:has(> .ai-table-plugin){box-sizing:border-box;position:sticky;top:8px;z-index:20;display:flex;flex-direction:column;height:auto;max-height:calc(100vh - 64px);overflow:hidden;background:var(--pc-color-surface)}.pc-intake .pi-card:has(> .ai-table-plugin)>.pi-table-toolbar,.pc-intake .pi-card:has(> .ai-table-plugin)>.pi-batch-bar{flex:none}.pc-intake .pi-card:has(> .ai-table-plugin)>.ai-table-plugin{display:flex;flex:1;flex-direction:column;min-height:0;overflow:hidden}.pc-intake .ai-table-plugin>.flex.w-full.flex-col{display:flex;flex:1;flex-direction:column;min-height:0;overflow:hidden}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t{display:flex;flex:1;flex-direction:column;min-height:0;overflow:auto}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t>.overflow-x-auto,.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t .relative.w-full.overflow-x-auto{flex:1;min-height:0;overflow:visible!important}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t+div{flex:0 0 auto;background:var(--pc-color-surface)}.pc-intake .ai-table-plugin thead{position:sticky;top:0;z-index:20}.pc-intake .ai-table-plugin thead th{background:var(--pc-color-table-header);background-clip:padding-box}.pi-dashboard-panel-heading-actions{display:flex;align-items:center;gap:8px}.pi-dashboard-todo-more{white-space:nowrap}.pi-dashboard-list--todo{gap:0}.pi-dashboard-todo-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--pc-color-border-subtle)}.pi-dashboard-todo-row:last-child{border-bottom:0}.pi-dashboard-todo-open{display:flex;flex:1;align-items:flex-start;gap:9px;min-width:0;padding:0;border:0;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}.pi-dashboard-todo-open:hover .pi-dashboard-row-title{color:var(--pc-color-primary-hover)}.pi-dashboard-todo-row.is-read .pi-dashboard-row-title{color:var(--pc-color-text-muted);font-weight:500}.pi-dashboard-todo-row.is-read .pi-dashboard-row-icon{opacity:.65}.pi-dashboard-todo-read{display:inline-flex;flex:none;align-items:center;gap:4px;padding:4px 6px;border:0;border-radius:6px;background:transparent;color:var(--pc-color-text-muted);font:inherit;font-size:10px;cursor:pointer}.pi-dashboard-todo-read:hover{background:var(--pc-color-neutral-bg);color:var(--pc-color-text-secondary)}.pi-dashboard-todo-read svg{width:13px;height:13px}.pi-dashboard-todo-dialog{display:flex;flex-direction:column;max-width:min(620px,calc(100vw - 32px));max-height:calc(100vh - 32px);padding:0;overflow:hidden}.pi-dashboard-todo-dialog-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid var(--pc-color-border)}.pi-dashboard-todo-dialog-heading h3{margin:0;color:var(--pc-color-text);font-size:15px;font-weight:650}.pi-dashboard-todo-dialog-heading p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-dashboard-todo-dialog-list{min-height:0;overflow-y:auto;padding:8px 18px 14px}.pi-dashboard-todo-dialog-list .pi-dashboard-todo-row{padding:10px 0}.pi-dashboard-todo-dialog-list .pi-dashboard-row-title{font-size:12px}.pi-dashboard-todo-dialog-list .pi-dashboard-row-description{font-size:11px}'
const interactionFixCSS = '.pi-cell-tooltip{position:fixed;z-index:9999;max-width:min(420px,70vw);width:max-content;padding:6px 8px;border:1px solid rgb(255 255 255 / 12%);border-radius:6px;background:#171717;color:#fff;box-shadow:0 4px 14px rgb(0 0 0 / 22%);font:12px/1.45 var(--pc-font-sans);white-space:normal;overflow-wrap:anywhere;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 80ms ease-out}.pi-cell-tooltip.is-visible{opacity:1;visibility:visible}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t{overflow:hidden!important}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t>.overflow-x-auto{flex:1;min-height:0;overflow:auto!important;overscroll-behavior:contain}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t+div{flex:0 0 auto;position:sticky;bottom:0;z-index:31;background:var(--pc-color-surface)}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t>.overflow-x-auto>[data-slot=table-container]{width:max-content;min-width:100%;overflow:visible!important}.pc-intake .ai-table-plugin thead{position:sticky;top:0;z-index:30}.pc-intake .ai-table-plugin thead th{background:var(--pc-color-table-header);background-clip:padding-box}'
const workspaceCSS = '.pi-dashboard{display:flex;flex-direction:column;gap:12px}.pi-dashboard-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.pi-dashboard-heading h1{margin:0;font-size:17px;font-weight:650}.pi-dashboard-heading p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-dashboard-refresh{display:inline-flex;align-items:center;gap:6px;flex:none}.pi-dashboard-refresh svg{width:14px;height:14px}.pi-dashboard-refresh.is-loading svg{animation:pi-intake-spin .75s linear infinite}.pi-dashboard-metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.pi-dashboard-metric{min-width:0;padding:13px 14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface)}.pi-dashboard-metric-top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--pc-color-text-secondary);font-size:11px}.pi-dashboard-metric-top svg{width:16px;height:16px;flex:none;color:var(--pc-color-text-muted)}.pi-dashboard-metric strong{display:block;margin-top:8px;color:var(--pc-color-text);font-size:24px;line-height:1.15;font-weight:650;font-variant-numeric:tabular-nums}.pi-dashboard-metric.is-actionable{cursor:pointer;transition:border-color 120ms ease-out,background-color 120ms ease-out}.pi-dashboard-metric.is-actionable:hover{border-color:var(--pc-color-border-strong);background:var(--pc-color-surface-hover)}.pi-dashboard-main-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,1fr);gap:12px;align-items:stretch}.pi-dashboard-panel{min-width:0;padding:14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface)}.pi-dashboard-panel-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}.pi-dashboard-panel-heading h2{margin:0;font-size:13px;font-weight:650}.pi-dashboard-panel-heading p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:10px}.pi-dashboard-chart{height:236px;min-height:236px;width:100%}.pi-chart-tooltip{min-width:132px;padding:8px 10px;border:1px solid var(--pc-color-border);border-radius:8px;background:var(--pc-color-surface);box-shadow:var(--pc-shadow-menu);color:var(--pc-color-text);font-size:11px}.pi-chart-tooltip-title{margin-bottom:5px;color:var(--pc-color-text-muted);font-size:10px}.pi-chart-tooltip-row{display:flex;align-items:center;gap:6px}.pi-chart-tooltip-row+ .pi-chart-tooltip-row{margin-top:4px}.pi-chart-tooltip-dot{width:8px;height:8px;border-radius:50%;flex:none}.pi-chart-tooltip-row strong{margin-left:auto;font-variant-numeric:tabular-nums}.pi-dashboard-list{display:flex;flex-direction:column;gap:2px}.pi-dashboard-row{display:flex;align-items:flex-start;gap:9px;width:100%;min-width:0;padding:9px 2px;border:0;border-bottom:1px solid var(--pc-color-border-subtle);background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}.pi-dashboard-row:last-child{border-bottom:0}.pi-dashboard-row:hover .pi-dashboard-row-title{color:var(--pc-color-primary-hover)}.pi-dashboard-row-icon{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:7px;background:var(--pc-color-neutral-bg);color:var(--pc-color-text-secondary)}.pi-dashboard-row-icon svg{width:14px;height:14px}.pi-dashboard-row-copy{flex:1;min-width:0}.pi-dashboard-row-title{display:block;overflow:hidden;color:var(--pc-color-text);font-size:11px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.pi-dashboard-row-description{display:block;margin-top:3px;overflow:hidden;color:var(--pc-color-text-muted);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.pi-dashboard-row-time{flex:none;color:var(--pc-color-text-muted);font-size:10px;white-space:nowrap}.pi-dashboard-empty{display:grid;min-height:120px;place-items:center;padding:18px;color:var(--pc-color-text-muted);font-size:11px;text-align:center}.pi-dashboard-activity{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}.pi-dashboard-activity .pi-dashboard-row{padding:8px 2px}@media(max-width:1000px){.pi-dashboard-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:600px){.pi-dashboard-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.pi-dashboard-main-grid{grid-template-columns:1fr}.pi-dashboard-activity{grid-template-columns:1fr}}@media(max-width:480px){.pi-dashboard-heading{align-items:flex-start}.pi-dashboard-refresh span{display:none}.pi-dashboard-metric{padding:11px}.pi-dashboard-metric strong{font-size:21px}}'
const namespace = 'procurementIntake'
const zh = {
  category: '采购需求', title: 'Hilda’s Harness Space', subtitle: '导入明细，按物料名称筛选，再确认由你跟进。', pendingTab: '待筛选', mineTab: '我的需求', createdAt: '创建时间', updatedAt: '更新时间', masterDataFields: '资料信息',
  chooseFile: '选择 NC 导出的 Excel 文件', fileTypeError: '请选择 NC 导出的 .xls 或 .xlsx 文件。', fileSizeError: '文件超过 20 MB，请缩小导出范围后重试。',
  fileReadError: '文件解析失败，请检查文件格式。', noSheets: '文件中没有可读取的工作表。', noRows: '没有找到可导入的请购单明细。',
  noHeader: '工作表“{name}”中没有识别到请购单号和物料名称列。', importPreview: '导入预览', lines: '条明细', reviewCount: '条待复核',
  columnsRecognized: '列已识别', importPool: '导入待筛选池', importing: '正在导入待筛选池…', saveError: '保存失败，请检查浏览器可用空间后重试。', latestImport: '最近导入',
  keywordLabel: '物料名称关键词', keywordPlaceholder: '例如：PDA 电池，扫码枪', candidates: '候选明细', selectAll: '全选当前表格中的明细', review: '待复核',
  noCandidates: '暂无待筛选明细。先导入 NC 请购单。', claimSelected: '认领为我的需求', myRequests: '我的采购需求', noMine: '尚未认领采购需求。',
  localStorageNote: '文件在浏览器解析；数据保存在 Harness 后台，与 AI 共用同一份。', requisitionNo: '请购单', material: '物料名称',
  copy: '复制', copySuccess: '复制成功', copyFailed: '复制失败，请重试。',
  duplicateIdentity: '同一文件中存在重复的请购明细标识，请复核', expectedShip: '预计发货日期', rowName: '未命名列{index}', quantity: '数量', lineNo: 'NC明细行', procurementOrg: '采购组织',
  drop: '拖放 NC 导出文件到这里', select: '浏览文件', parsing: '正在解析工作簿…', parseHelp: '请购单号和物料名称列会自动识别', fileHelp: '支持 .xls / .xlsx · 最多 20 MB',
  previewHelp: '确认导入后，明细进入待筛选池；认领前不会加入我的需求。', chooseSheet: '工作表', reviewHelp: '缺少关键信息或存在重复标识，请在认领前复核。',
  searchHelp: '多个词任一命中；支持空格、逗号、顿号、分号或竖线。', clear: '清空', selected: '已选', matches: '命中', orders: '张请购单',
  context: '同单其他明细', contextOnly: '仅作上下文，不会自动认领', claimed: '已认领', notFound: '没有找到匹配的物料', tryShorter: '试试更短的关键词，或清空条件。',
  imported: '已导入', added: '新增', updated: '更新', sheets: '工作表', source: '来源', expectedDate: '需求日期', spec: '规格 / 型号',
  purchaseOrder: '采购订单号', supplier: '供应商', materialCode: '物料编码', materialCategory: '物料分类', claimedAt: '认领时间', tableTotal: '共 {count} 条', clearPending: '清空待筛选', clearPendingConfirm: '确认清空所有待筛选明细？已认领的不受影响。', delete: '删除', deleteConfirm: '确认删除这条已认领明细？', shipEdit: '填写发货时间', workspace: '工作台', requests: '采购需求', ordersMenu: '订单交付', issues: '异常处理', fullscreen: '全屏', comingSoon: '该模块正在规划中。', modelSettings: '模型设置', modelLabel: '模型', reasoningEffortLabel: '推理强度', saveSettings: '保存设置', settingsSaved: '设置已保存', settingsSaveError: '保存设置失败，请重试。', materialInfo: '物料信息', orderStatus: '采购订单状态', nextAction: '下一步待办', waitingOn: '等待对象', notes: '处理备注', remainingQuantity: '未到货数量', viewDetails: '查看详情', detailTitle: '采购需求详情', detailBasics: '需求信息', followupSection: '采购跟进', saveDetail: '保存跟进', saving: '保存中…', detailSaved: '跟进信息已保存', notRecorded: '未记录', sourceFile: '导入文件', importedAt: '导入时间', activityHistory: '操作记录', close: '关闭', batchSupplier: '批量更新供应商', batchSupplierConfirm: '将为已选中的 {count} 条明细填写供应商。', batchSupplierSaved: '已为 {count} 条明细填写供应商。', supplierPlaceholder: '如：东集、盈达、汉印', orderImportHelp: '选择采购订单 Excel，每个文件创建一张订单；单次最多 10 个文件。', orderFiles: '选择订单文件', orderPreview: '待导入订单', importOrders: '导入采购订单', orderImporting: '正在导入订单…', orderNo: '订单编号', orderDateLabel: '订单日期', itemCount: '商品明细', orderTotal: '含税金额', deliveryAddressLabel: '交付地点', orderDetails: '订单详情', noOrders: '暂无采购订单，请先导入订单 Excel。', orderDuplicate: '订单编号已存在，将跳过重复订单。', batchFileLimit: '一次最多选择 10 个 Excel 文件。', orderImportSuccess: '订单导入完成', orderParseError: '以下文件无法识别', previousPage: '上一页', nextPage: '下一页', pageLabel: '第 {page} 页，共 {count} 张订单',
  masterData: '基础资料', suppliers: '供应商', materials: '物料', materialCategories: '物料分类', masterDataHelp: '从导入数据沉淀并维护采购常用基础资料。', masterDataLoading: '正在读取基础资料…', masterDataImportedSummary: '新增沉淀基础资料 {count} 条', addMasterRecord: '新增资料', editMasterRecord: '编辑资料', masterName: '名称', masterCode: '编码', masterSpecification: '规格 / 型号', masterUnit: '单位', masterStatus: '状态', enabled: '启用', disabled: '停用', enableSelected: '批量启用', disableSelected: '批量停用', masterDeleteConfirm: '确认删除选中的 {count} 条基础资料？', masterSaved: '基础资料已保存', masterDeleted: '已删除 {count} 条资料', masterStatusUpdated: '已更新 {count} 条资料状态', noMasterData: '暂无资料。导入请购单或采购订单后，会自动沉淀不重复数据。', cancelEdit: '取消',
}
const en = {
  category: 'Procurement', title: 'Hilda’s Harness Space', subtitle: 'Import lines, filter by material name, then confirm which requests you will own.', pendingTab: 'To review', mineTab: 'My requests', createdAt: 'Created at', updatedAt: 'Updated at', masterDataFields: 'Record details',
  chooseFile: 'Choose an NC Excel export', fileTypeError: 'Choose an NC .xls or .xlsx export.', fileSizeError: 'The file exceeds 20 MB. Narrow the export and try again.',
  fileReadError: 'Could not read the file. Check its format and try again.', noSheets: 'The file has no readable worksheets.', noRows: 'No requisition lines were found to import.',
  noHeader: 'Worksheet “{name}” has no recognized requisition number and material name columns.', importPreview: 'Import preview', lines: 'lines', reviewCount: 'need review',
  columnsRecognized: 'columns recognized', importPool: 'Import to review pool', importing: 'Importing to the review pool…', saveError: 'Could not save. Check available browser storage and try again.', latestImport: 'Latest import',
  keywordLabel: 'Material name keywords', keywordPlaceholder: 'For example: PDA battery, scanner', candidates: 'Candidate lines', selectAll: 'Select all rows in the table', review: 'Review',
  noCandidates: 'No lines to review. Import an NC requisition file first.', claimSelected: 'Claim as my request', myRequests: 'My procurement requests', noMine: 'You have not claimed any requests yet.',
  localStorageNote: 'Files are parsed in the browser. Data is stored in the Harness backend and shared with the AI.', requisitionNo: 'Requisition', material: 'Material name',
  copy: 'Copy', copySuccess: 'Copied', copyFailed: 'Could not copy. Try again.',
  duplicateIdentity: 'Duplicate requisition line identity in this file; review it.', expectedShip: 'Expected ship date', rowName: 'Unnamed column {index}', quantity: 'Quantity', lineNo: 'NC line', procurementOrg: 'Procurement organization',
  drop: 'Drop an NC export here', select: 'Browse files', parsing: 'Parsing workbook…', parseHelp: 'Requisition number and material name are detected automatically', fileHelp: 'XLS / XLSX · up to 20 MB',
  previewHelp: 'Import adds lines to the review pool. They become yours only after claiming.', chooseSheet: 'Worksheet', reviewHelp: 'Missing key information or duplicate identity; review before claiming.',
  searchHelp: 'Match any term; separate with spaces, commas, semicolons, or |.', clear: 'Clear', selected: 'Selected', matches: 'matches', orders: 'requisitions',
  context: 'Other lines on this requisition', contextOnly: 'For context only; these will not be claimed automatically', claimed: 'Claimed', notFound: 'No matching material found', tryShorter: 'Try a shorter keyword or clear the search.',
  imported: 'Imported', added: 'added', updated: 'updated', sheets: 'worksheets', source: 'Source', expectedDate: 'Demand date', spec: 'Spec / model',
  purchaseOrder: 'Purchase order no.', supplier: 'Supplier', materialCode: 'Material code', materialCategory: 'Material category', claimedAt: 'Claimed at', tableTotal: '{count} in total', clearPending: 'Clear pending', clearPendingConfirm: 'Clear all pending lines? Claimed lines are kept.', delete: 'Delete', deleteConfirm: 'Delete this claimed line?', shipEdit: 'Set ship date', workspace: 'Workspace', requests: 'Requests', ordersMenu: 'Orders', issues: 'Exceptions', fullscreen: 'Fullscreen', comingSoon: 'This module is planned.', modelSettings: 'Model settings', modelLabel: 'Model', reasoningEffortLabel: 'Reasoning effort', saveSettings: 'Save settings', settingsSaved: 'Settings saved', settingsSaveError: 'Could not save settings.', materialInfo: 'Material info', orderStatus: 'Purchase order status', nextAction: 'Next action', waitingOn: 'Waiting on', notes: 'Notes', remainingQuantity: 'Remaining qty', viewDetails: 'View details', detailTitle: 'Procurement request details', detailBasics: 'Request details', followupSection: 'Procurement follow-up', saveDetail: 'Save follow-up', saving: 'Saving…', detailSaved: 'Follow-up saved', notRecorded: 'Not recorded', sourceFile: 'Import file', importedAt: 'Imported at', activityHistory: 'Activity history', close: 'Close', batchSupplier: 'Update supplier in bulk', batchSupplierConfirm: 'The supplier will be filled for {count} selected lines.', batchSupplierSaved: 'Supplier filled for {count} lines.', supplierPlaceholder: 'e.g. a vendor name', orderImportHelp: 'Select purchase order Excel files. Each file creates one order; up to 10 files per import.', orderFiles: 'Choose order files', orderPreview: 'Orders to import', importOrders: 'Import purchase orders', orderImporting: 'Importing orders…', orderNo: 'Order number', orderDateLabel: 'Order date', itemCount: 'Items', orderTotal: 'Tax inclusive total', deliveryAddressLabel: 'Delivery address', orderDetails: 'Order details', noOrders: 'No purchase orders yet. Import Excel files to begin.', orderDuplicate: 'Order number already exists; duplicate orders will be skipped.', batchFileLimit: 'Choose up to 10 files at a time.', orderParseError: 'Files that could not be read', previousPage: 'Previous', nextPage: 'Next', pageLabel: 'Page {page} · {count} orders',
  masterData: 'Master data', suppliers: 'Suppliers', materials: 'Materials', materialCategories: 'Material categories', masterDataHelp: 'Build and maintain reusable procurement records from imports.', masterDataLoading: 'Loading master data…', masterDataImportedSummary: 'Added {count} master data records', addMasterRecord: 'Add record', editMasterRecord: 'Edit record', masterName: 'Name', masterCode: 'Code', masterSpecification: 'Spec / model', masterUnit: 'Unit', masterStatus: 'Status', enabled: 'Enabled', disabled: 'Disabled', enableSelected: 'Enable selected', disableSelected: 'Disable selected', masterDeleteConfirm: 'Delete {count} selected master records?', masterSaved: 'Master data saved', masterDeleted: 'Deleted {count} records', masterStatusUpdated: 'Updated status for {count} records', noMasterData: 'No records yet. Import requisitions or purchase orders to collect unique data automatically.', cancelEdit: 'Cancel',
}

Object.assign(zh, { deleteSelected: '删除所选', orderBuyer: '采购方', orderItems: '产品名称', orderQuantity: '商品数量', taxExclusiveTotal: '不含税金额', taxRate: '税率', recipient: '收货人', recipientPhone: '收货电话', deliveryTime: '交付时间', paymentTerms: '付款条款', orderFiles: '选择订单文件夹', orderImportHelp: '选择包含采购订单 Excel 的文件夹，自动识别模板并跳过重复订单。', folderNoExcel: '所选文件夹中没有 .xls 或 .xlsx 文件。', allOrdersDuplicate: '识别到 {count} 张重复订单，已全部跳过。', duplicatesSkipped: '跳过重复 {count} 张' })
Object.assign(zh, { deleteOrdersSelected: '删除所选 {count} 张', orderTotalCount: '共 {count} 张订单', otherTerms: '其他约定', orderInformation: '订单信息', orderItemSequence: '序号', unitPrice: '单价', lineAmount: '金额', orderTerms: '订单条款' })
Object.assign(zh, { orderImportTab: '订单导入', orderManageTab: '订单管理', startOrderImport: '去导入订单', selectAllQualified: '全选合格项', selectedQualifiedCount: '已选 {selected} / {total} 张', importSelectedOrders: '导入所选', importAllOrders: '全部导入' })
Object.assign(zh, { deliveryTermsGroup: '交付信息', procurementOrg: '采购组织' })
Object.assign(en, { procurementOrg: 'Procurement organization' })
Object.assign(zh, { dashboardTitle: '工作台', dashboardSubtitle: '采购需求与订单的当前进展、待办和近期导入情况。', refreshDashboard: '刷新数据', dashboardLoading: '正在汇总工作台数据…', dashboardLoadError: '工作台数据读取失败，请刷新重试。', metricPending: '待筛选明细', metricMine: '我的需求', metricOrders: '采购订单', metricWaitingNotice: '待通知供应商', metricUnmatched: '未匹配采购单', metricOverdue: '逾期未到货', chartTitle: '近 30 天导入趋势', chartSubtitle: '按数据导入时间统计，不代表采购业务发生量。', chartRequisitions: '请购明细', chartOrders: '采购订单', todoTitle: '待办事项', activityTitle: '最近处理', noTodos: '目前没有待处理事项。', noActivity: '还没有处理记录。', noTrend: '暂无近 30 天的导入记录。', openRecord: '查看记录', todoCount: '{count} 项待办', dashboardNoticeAction: '通知供应商', dashboardOverdueAction: '跟进逾期到货', dashboardNextAction: '需求跟进', daysAgoToday: '今天', dashboardRequest: '采购需求', dashboardOrder: '采购订单', viewAllTodos: '查看更多', markAsRead: '标记已读', markAsUnread: '标记未读', todoRead: '已读', todoUnread: '未读', allTodos: '全部待办', todoReadUpdateError: '待办状态更新失败，请重试。' })
Object.assign(en, { dashboardTitle: 'Workspace', dashboardSubtitle: 'Current procurement progress, open actions, and recent imports.', refreshDashboard: 'Refresh data', dashboardLoading: 'Loading workspace summary…', dashboardLoadError: 'Could not load workspace data. Refresh and try again.', metricPending: 'Lines to review', metricMine: 'My requests', metricOrders: 'Purchase orders', metricWaitingNotice: 'Awaiting supplier notice', metricUnmatched: 'Unmatched requisitions', metricOverdue: 'Overdue deliveries', chartTitle: 'Imports in the last 30 days', chartSubtitle: 'Grouped by import date; this is not a measure of business activity.', chartRequisitions: 'Requisition lines', chartOrders: 'Purchase orders', todoTitle: 'To do', activityTitle: 'Recent activity', noTodos: 'There are no open actions right now.', noActivity: 'No activity recorded yet.', noTrend: 'No imports in the last 30 days.', openRecord: 'Open record', todoCount: '{count} open items', dashboardNoticeAction: 'Notify supplier', dashboardOverdueAction: 'Follow up overdue delivery', dashboardNextAction: 'Request follow-up', daysAgoToday: 'Today', dashboardRequest: 'Request', dashboardOrder: 'Purchase order', viewAllTodos: 'View all', markAsRead: 'Mark read', markAsUnread: 'Mark unread', todoRead: 'Read', todoUnread: 'Unread', allTodos: 'All to-dos', todoReadUpdateError: 'Could not update the to-do state. Try again.' })
Object.assign(zh, { purchaseOrderStatus: '采购订单状态', pendingVendorNotice: '待通知供应商', vendorNotified: '已通知供应商', purchaseOrderCancelled: '取消了采购订单', orderActions: '操作', cancelOrder: '取消订单', cancelOrderConfirm: '确认取消这张采购订单？订单会保留，并标记为“取消了采购订单”。', cancelOrderSuccess: '采购订单已取消' })
Object.assign(zh, { notifyOrdersSelected: '已通知供应商', notifyOrdersConfirm: '确认将选中的 {count} 张采购订单更新为“已通知供应商”？已取消的订单会跳过。', notifyOrdersSuccess: '已将 {count} 张采购订单更新为“已通知供应商”。' })
Object.assign(zh, { syncPurchaseOrders: '同步采购订单', syncPurchaseOrdersLoading: '正在同步订单…', syncPurchaseOrdersResult: '已同步 {count} 张请购单，补齐 {lines} 条明细；未匹配 {unmatched} 张请购单。' })
Object.assign(en, { syncPurchaseOrders: 'Sync purchase orders', syncPurchaseOrdersLoading: 'Syncing orders…', syncPurchaseOrdersResult: 'Synced {count} requisitions and filled {lines} lines; {unmatched} requisitions had no match.' })
Object.assign(en, { purchaseOrderStatus: 'Purchase order status', pendingVendorNotice: 'Pending supplier notification', vendorNotified: 'Supplier notified', purchaseOrderCancelled: 'Purchase order cancelled', orderActions: 'Actions', cancelOrder: 'Cancel order', cancelOrderConfirm: 'Cancel this purchase order? It will be kept and marked as cancelled.', cancelOrderSuccess: 'Purchase order cancelled' })
Object.assign(zh, { unmatchedPurchaseOrder: '未匹配采购单' })
Object.assign(en, { unmatchedPurchaseOrder: 'No matching purchase order' })
Object.assign(en, { notifyOrdersSelected: 'Mark as supplier notified', notifyOrdersConfirm: 'Mark {count} selected purchase orders as “Supplier notified”? Cancelled orders will be skipped.', notifyOrdersSuccess: 'Marked {count} purchase orders as supplier notified.' })
Object.assign(zh, { skippedOrderRows: '已跳过 {count} 条没有订单号的请购明细。', skippedOrderRowsHelp: '无订单号的请购明细不会作为采购订单导入。', inventoryOrg: '库存组织', requisitionType: '请购类型', preparer: '制单人', requisitionNos: '请购单号', procurementOfficer: '采购员', procurementDepartment: '采购部门', project: '项目', expectedArrivalDate: '计划到货日期', arrivalDate: '到货日期', receivedQuantity: '到货主数量', returnedQuantity: '退货主数量', stockInDate: '入库日期', customer: '客户', stockInQuantity: '入库主数量', returnedStockQuantity: '退库主数量', replenishmentQuantity: '补货主数量', unexecutedCloseQuantity: '未执行关闭数量', requisitionLineClosed: '请购单行关闭标识', sourceDocumentNo: '源头单据号', sourceDocumentLineNo: '源头单据行号', lineRemark: '行备注', requisitionQuantity: '请购数量', orderedQuantity: '订货主数量', demandDate: '需求日期', suggestedOrderDate: '建议订货日期', unitLabel: '单位', orderQuantity: '订货主数量', executionReportHelp: '识别请购单执行情况查询模板，按订单号汇总，并跳过没有订单号的明细。', orderImportHelp: '选择请购单执行情况查询 Excel，按订单号汇总订单并跳过未生成订单号的明细。' })
Object.assign(en, { skippedOrderRows: 'Skipped {count} requisition lines without a purchase order number.', skippedOrderRowsHelp: 'Requisition lines without an order number are not imported as purchase orders.', inventoryOrg: 'Inventory organization', requisitionType: 'Requisition type', preparer: 'Prepared by', requisitionNos: 'Requisition numbers', procurementOfficer: 'Buyer', procurementDepartment: 'Procurement department', project: 'Project', expectedArrivalDate: 'Planned arrival date', arrivalDate: 'Arrival date', receivedQuantity: 'Received quantity', returnedQuantity: 'Returned quantity', stockInDate: 'Stock-in date', customer: 'Customer', stockInQuantity: 'Stock-in quantity', returnedStockQuantity: 'Returned stock quantity', replenishmentQuantity: 'Replenishment quantity', unexecutedCloseQuantity: 'Unexecuted close quantity', requisitionLineClosed: 'Requisition line closed', sourceDocumentNo: 'Source document number', sourceDocumentLineNo: 'Source document line number', lineRemark: 'Line remark', requisitionQuantity: 'Requisition quantity', orderedQuantity: 'Ordered quantity', demandDate: 'Demand date', suggestedOrderDate: 'Suggested order date', unitLabel: 'Unit', orderQuantity: 'Ordered quantity', executionReportHelp: 'Recognizes the requisition execution report and groups lines by purchase order number.', orderImportHelp: 'Choose the requisition execution report. Lines are grouped by order number; lines without an order number are skipped.' })
Object.assign(en, { deleteSelected: 'Delete selected', deleteOrdersSelected: 'Delete {count} selected', orderTotalCount: '{count} orders', otherTerms: 'Other terms', orderBuyer: 'Buyer', orderItems: 'Product names', orderQuantity: 'Item quantity', taxExclusiveTotal: 'Tax exclusive total', taxRate: 'Tax rate', recipient: 'Recipient', recipientPhone: 'Recipient phone', deliveryTime: 'Delivery time', paymentTerms: 'Payment terms', orderFiles: 'Choose order folder', orderImportHelp: 'Choose a folder of purchase order Excel files. Matching templates are parsed; duplicates are skipped.', folderNoExcel: 'The selected folder contains no .xls or .xlsx files.', allOrdersDuplicate: 'Found and skipped all {count} duplicate orders.', duplicatesSkipped: 'Skipped duplicates: {count}', orderInformation: 'Order information', orderItemSequence: 'No.', unitPrice: 'Unit price', lineAmount: 'Amount', orderTerms: 'Order terms', orderImportTab: 'Import orders', orderManageTab: 'Order management', startOrderImport: 'Import orders', selectAllQualified: 'Select all valid', selectedQualifiedCount: '{selected} of {total} selected', importSelectedOrders: 'Import selected', importAllOrders: 'Import all', deliveryTermsGroup: 'Delivery information' })
Object.assign(zh, { editOrderInfo: '编辑订单信息', saveOrderInfo: '保存订单信息', orderInfoSaved: '订单信息已保存', discardChanges: '取消编辑', noOperationHistory: '暂无操作记录', requisitionNumbersReadOnly: '请购单号根据商品明细汇总。' })
Object.assign(en, { editOrderInfo: 'Edit order information', saveOrderInfo: 'Save order information', orderInfoSaved: 'Order information saved', discardChanges: 'Discard changes', noOperationHistory: 'No operation history yet.', requisitionNumbersReadOnly: 'Requisition numbers are derived from the order items.' })

const css = `.pc-intake{--pc-color-background:#eef1f6;--pc-color-surface:#ffffff;--pc-color-surface-raised:#f7f9fc;--pc-color-text:#11192d;--pc-color-text-secondary:#50607a;--pc-color-text-muted:#7c889c;--pc-color-border:rgb(124 136 156 / 22%);--pc-color-border-strong:#c8cfdb;--pc-color-border-subtle:rgb(124 136 156 / 13%);--pc-color-border-primary:rgb(49 188 179 / 32%);--pc-color-primary:#31bcb3;--pc-color-primary-hover:#159b92;--pc-color-primary-foreground:#ffffff;--pc-color-primary-subtle:rgb(49 188 179 / 12%);--pc-color-focus:#8daeff;--pc-color-neutral-bg:rgb(124 136 156 / 11%);--pc-color-info:#007aff;--pc-color-info-bg:rgb(0 122 255 / 10%);--pc-color-success:#34c759;--pc-color-success-bg:rgb(52 199 89 / 12%);--pc-color-success-text:#288d4b;--pc-color-warning:#ff9500;--pc-color-warning-bg:rgb(255 149 0 / 13%);--pc-color-warning-text:#aa6708;--pc-color-danger:#ff3b30;--pc-color-danger-foreground:#ffffff;--pc-color-danger-bg:rgb(255 59 48 / 10%);--pc-color-danger-text:#d4483e;--pc-color-brand:#31bcb3;--pc-color-brand-strong:#159b92;--pc-color-brand-glow:rgb(39 186 178 / 22%);--pc-color-surface-hover:#fbfefd;--pc-color-table-header:#eef1f6;--pc-color-row-hover:#f7fafc;--pc-font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans SC",sans-serif;--pc-font-size-sm:0.75rem;--pc-font-size-md:0.875rem;--pc-font-size-table-header:0.6875rem;--pc-font-size-table-cell:0.75rem;--pc-space-1:0.25rem;--pc-space-2:0.5rem;--pc-space-3:0.75rem;--pc-space-4:1rem;--pc-radius-sm:0.375rem;--pc-radius-md:0.5rem;--pc-radius-lg:0.75rem;--pc-radius-pill:999px;--pc-shadow-menu:0 12px 32px rgb(17 25 45 / 12%);--pc-focus-ring:0 0 0 3px rgb(141 174 255 / 40%);box-sizing:border-box;flex:1 1 0;height:100%;min-height:0;width:100%;min-width:0;padding:16px;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable;color:var(--pc-color-text);font:13px/1.5 var(--pc-font-sans)}
[data-ds-dark-theme] .pc-intake{--pc-color-background:var(--dsw-alias-bg-base);--pc-color-surface:var(--dsw-alias-bg-layer-1);--pc-color-surface-raised:var(--dsw-alias-bg-layer-2);--pc-color-text:var(--dsw-alias-label-primary);--pc-color-text-secondary:var(--dsw-alias-label-secondary);--pc-color-text-muted:var(--dsw-alias-label-secondary);--pc-color-border:var(--dsw-alias-border-l1);--pc-color-border-strong:var(--dsw-alias-border-l2);--pc-color-border-subtle:var(--dsw-alias-border-l1);--pc-color-table-header:var(--dsw-alias-bg-layer-2);--pc-color-row-hover:var(--dsw-alias-bg-layer-2);--pc-color-surface-hover:var(--dsw-alias-bg-layer-2);--pc-color-primary:#4cd1c8;--pc-color-primary-hover:#5fdcd4;--pc-color-primary-foreground:#06201f;--pc-color-primary-subtle:rgb(49 188 179 / 16%)}
.pc-intake *{box-sizing:border-box}.pi-stack{display:flex;flex-direction:column;gap:12px;min-width:0}.pi-eyebrow{margin:0 0 3px;color:var(--pc-color-text-muted);font-size:11px}.pi-title{margin:0;font-size:17px;line-height:1.3;font-weight:650;letter-spacing:-.2px}.pi-subtitle{margin:5px 0 0;color:var(--pc-color-text-secondary);font-size:12px}
.pi-tabs{display:grid;grid-template-columns:1fr 1fr;gap:3px;padding:3px;border:1px solid var(--pc-color-border);border-radius:10px;background:var(--pc-color-surface-raised)}.pi-tab{min-width:0;padding:7px 6px;border:0;border-radius:7px;background:transparent;color:var(--pc-color-text-secondary);font:inherit;font-size:12px;cursor:pointer}.pi-tab[aria-pressed=true]{background:var(--pc-color-surface);color:var(--pc-color-text);box-shadow:0 1px 3px rgb(17 25 45 / 10%);font-weight:600}
.pi-card{min-width:0;padding:14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface)}.pi-section-title{margin:0;font-size:13px;font-weight:650}.pi-help{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-upload{display:flex;flex-direction:column;align-items:flex-start;gap:8px;border:1px dashed var(--pc-color-border-strong);background:var(--pc-color-surface-raised)}.pi-upload--active{border-color:var(--pc-color-primary);background:var(--pc-color-primary-subtle)}.pi-upload-name{font-size:12px;font-weight:600;overflow-wrap:anywhere}.pi-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:34px;padding:7px 12px;border:1px solid var(--pc-color-border-strong);border-radius:var(--pc-radius-md);background:var(--pc-color-surface);color:var(--pc-color-text);font:inherit;font-size:var(--pc-font-size-md);font-weight:600;text-align:center;cursor:pointer;transition:background-color 120ms ease-out,border-color 120ms ease-out,color 120ms ease-out}.pi-button:hover:not(:disabled){background:var(--pc-color-background)}.pi-button:focus-visible,.pi-input:focus-visible,.pi-select:focus-visible,.pi-check:focus-visible{box-shadow:var(--pc-focus-ring);outline:none}.pi-button--primary{width:100%;border-color:var(--pc-color-primary);background:var(--pc-color-primary);color:var(--pc-color-primary-foreground)}.pi-button--primary:hover:not(:disabled){background:var(--pc-color-primary-hover)}.pi-button:disabled{opacity:.55;cursor:not-allowed}.pi-hidden-input{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;clip-path:inset(50%)}
.pi-inline{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0}.pi-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}.pi-stat{min-width:0;padding:8px 6px;border-radius:8px;background:var(--pc-color-surface-raised);text-align:center}.pi-stat strong{display:block;font-size:16px;line-height:1.2}.pi-stat span{display:block;margin-top:3px;color:var(--pc-color-text-muted);font-size:10px}.pi-warn{color:var(--pc-color-warning-text)!important}.pi-sheet-select{display:flex;align-items:center;gap:6px;color:var(--pc-color-text-muted);font-size:11px}.pi-select{max-width:145px;min-width:0;height:32px;padding:4px 7px;border:1px solid var(--pc-color-border-strong);border-radius:var(--pc-radius-md);background:var(--pc-color-surface);color:var(--pc-color-text);font:inherit;font-size:11px}.pi-preview-list,.pi-list{display:flex;flex-direction:column;gap:7px;margin-top:9px}.pi-line{min-width:0;padding:9px;border:1px solid var(--pc-color-border);border-radius:9px;background:var(--pc-color-surface)}.pi-line--context{background:var(--pc-color-surface-raised)}.pi-line-top{display:flex;align-items:flex-start;gap:8px;min-width:0}.pi-check{width:16px;height:16px;flex:0 0 auto;margin:2px 0 0;accent-color:var(--pc-color-primary);cursor:pointer}.pi-line-copy{flex:1;min-width:0}.pi-material{margin:0;font-size:12px;font-weight:620;line-height:1.4;overflow-wrap:anywhere}.pi-badges{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}.pi-badge{display:inline-flex;align-items:center;max-width:100%;padding:2px 7px;border-radius:var(--pc-radius-pill);background:var(--pc-color-primary-subtle);color:var(--pc-color-primary);font-size:11px;font-weight:550;line-height:1.4;overflow-wrap:anywhere}.pi-badge--warn{background:var(--pc-color-warning-bg);color:var(--pc-color-warning-text)}.pi-badge--ok{background:var(--pc-color-success-bg);color:var(--pc-color-success-text)}.pi-meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;margin:7px 0 0;color:var(--pc-color-text-secondary);font-size:10px}.pi-meta span{min-width:0;overflow-wrap:anywhere}.pi-meta b{color:var(--pc-color-text-muted);font-weight:500}.pi-rule{height:1px;margin:10px 0;border:0;background:var(--pc-color-border)}
.pi-group{min-width:0;overflow:hidden;border:1px solid var(--pc-color-border);border-radius:10px;background:var(--pc-color-surface)}.pi-group-head{padding:9px 10px;background:var(--pc-color-surface-raised)}.pi-group-title{min-width:0;font-size:12px;font-weight:650;overflow-wrap:anywhere}.pi-group-count{flex:0 0 auto;color:var(--pc-color-text-muted);font-size:10px}.pi-context{margin:7px 9px 9px;border-top:1px solid var(--pc-color-border);padding-top:7px}.pi-context summary{color:var(--pc-color-text-secondary);font-size:10px;cursor:pointer}.pi-empty{padding:20px 12px;text-align:center}.pi-empty strong{display:block;font-size:12px}.pi-empty p{margin:5px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-empty-state-content{display:flex;flex-direction:column;align-items:center;gap:4px}.pi-empty-state-illustration{display:block;width:min(340px,68vw);height:auto;max-height:218px;object-fit:contain;margin:0 auto 5px;pointer-events:none;user-select:none}.pi-empty-state-copy{max-width:560px}.pi-empty-state-copy strong{display:block;color:var(--pc-color-text);font-size:12px;font-weight:650}.pi-empty-state-copy p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-empty-state-content.is-compact .pi-empty-state-illustration{width:min(220px,52vw);max-height:142px;margin-bottom:0}.pi-empty-state-content.is-compact .pi-empty-state-copy strong{font-size:11px}.pi-dashboard-empty .pi-empty-state-illustration{width:min(150px,42vw);max-height:96px;margin-bottom:0}.pi-dashboard-empty .pi-empty-state-content{gap:0}.pi-success{padding:9px 10px;border:1px solid rgb(52 199 89 / 24%);border-radius:9px;background:var(--pc-color-success-bg);color:var(--pc-color-success-text);font-size:11px}.pi-error{margin:0;padding:8px 9px;border-radius:8px;background:var(--pc-color-danger-bg);color:var(--pc-color-danger-text);font-size:11px}.pi-footer{margin:2px 0 0;padding-top:9px;border-top:1px solid var(--pc-color-border);color:var(--pc-color-text-muted);font-size:10px}.pi-latest{color:var(--pc-color-text-muted);font-size:10px;overflow-wrap:anywhere}
.pi-table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0}.pi-table-total{flex:0 0 auto;color:var(--pc-color-text-muted);font-size:11px;font-variant-numeric:tabular-nums}.pi-table-wrap{position:relative;margin-top:10px;overflow:auto;max-height:min(430px,58vh);border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface);overscroll-behavior:contain;scrollbar-width:thin}.pi-table{width:100%;min-width:1150px;border-collapse:separate;border-spacing:0;font-size:var(--pc-font-size-table-cell);line-height:1.45}.pi-table thead th{position:sticky;top:0;z-index:2;padding:10px 12px;border-bottom:1px solid var(--pc-color-border);background:var(--pc-color-table-header);color:var(--pc-color-text-secondary);font-size:var(--pc-font-size-table-header);font-weight:700;letter-spacing:.2px;text-align:left;white-space:nowrap}.pi-table thead th.pi-th--num{text-align:right}.pi-table tbody td{padding:10px 12px;border-bottom:1px solid var(--pc-color-border-subtle);vertical-align:top;background:var(--pc-color-surface);color:var(--pc-color-text)}.pi-table tbody tr:last-child td{border-bottom:0}.pi-table tbody tr:hover td{background:var(--pc-color-row-hover)}.pi-table .pi-td--material{position:sticky;left:0;z-index:1;min-width:200px;max-width:230px;border-right:1px solid var(--pc-color-border)}.pi-table thead .pi-th--material{position:sticky;left:0;z-index:3;min-width:200px;max-width:230px;border-right:1px solid var(--pc-color-border)}.pi-table .pi-td--num{text-align:right;font-variant-numeric:tabular-nums}.pi-cell{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pi-cell--muted{color:var(--pc-color-text-muted)}.pi-material-cell{min-width:0;max-width:230px}.pi-material-cell-name{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:620;color:var(--pc-color-text)}.pi-material-cell-code{display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pc-color-text-muted);font-size:10px}.pi-eta-chip{display:inline-flex;align-items:center;max-width:100%;padding:2px 7px;border:1px solid var(--pc-color-border-primary);border-radius:6px;background:var(--pc-color-primary-subtle);color:var(--pc-color-primary)}
.pi-button--small{min-height:28px;padding:3px 10px;font-size:12px;border-radius:var(--pc-radius-md)}.pi-eta-input{width:100%;min-width:96px;height:28px;padding:3px 6px;border:1px solid var(--pc-color-border-strong);border-radius:var(--pc-radius-md);background:var(--pc-color-surface);color:var(--pc-color-text);font:inherit;font-size:11px}.pi-eta-input:focus{border-color:var(--pc-color-primary);box-shadow:var(--pc-focus-ring);outline:none}.pi-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;min-width:0}.pi-menu{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:3px;padding:3px;border:1px solid var(--pc-color-border);border-radius:10px;background:var(--pc-color-surface-raised)}.pi-menu-item{display:flex;min-width:0;align-items:center;justify-content:center;gap:6px;padding:7px 4px;border:0;border-radius:7px;background:transparent;color:var(--pc-color-text-secondary);font:inherit;font-size:12px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pi-menu-item svg{width:14px;height:14px;flex:0 0 auto;stroke-width:1.8}.pi-menu-item span{min-width:0;overflow:hidden;text-overflow:ellipsis}.pi-menu-item[aria-current=page]{background:var(--pc-color-surface);color:var(--pc-color-text);box-shadow:0 1px 3px rgb(17 25 45 / 10%);font-weight:600}.pi-badge--info{background:var(--pc-color-info-bg);color:var(--pc-color-info)}.pi-badge--neutral{background:var(--pc-color-neutral-bg);color:var(--pc-color-text-secondary)}.pi-badge--danger{background:var(--pc-color-danger-bg);color:var(--pc-color-danger-text)}
.pi-input{background:var(--pc-color-surface);border:1px solid var(--pc-color-border-strong);border-radius:var(--pc-radius-md);color:var(--pc-color-text);font:inherit;font-size:var(--pc-font-size-sm);height:2.375rem;min-width:0;padding:0 var(--pc-space-3);width:100%}.pi-input::placeholder{color:var(--pc-color-text-muted)}.pi-button--danger{background:var(--pc-color-danger);color:var(--pc-color-danger-foreground);border-color:var(--pc-color-danger)}.pi-button--danger:hover:not(:disabled){background:var(--pc-color-danger);filter:brightness(0.93)}.pi-batch-bar{display:flex;flex-wrap:wrap;align-items:flex-end;gap:8px;padding:10px 12px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface-raised)}.pi-batch-date{height:2.25rem;padding:0 8px;border:1px solid var(--pc-color-border-strong);border-radius:var(--pc-radius-md);background:var(--pc-color-surface);color:var(--pc-color-text);font:inherit;font-size:12px}.pi-batch-date-label{display:inline-flex;align-items:center;gap:6px;color:var(--pc-color-text-secondary);font-size:12px}.pi-row-actions{display:flex;align-items:center;gap:6px}.pi-dialog-overlay{background:rgb(17 25 45 / 22%);inset:0;position:fixed;z-index:80;display:flex;align-items:center;justify-content:center;padding:1rem}.pi-dialog-panel{background:var(--pc-color-surface);border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);box-shadow:var(--pc-shadow-menu);max-width:24rem;width:100%;padding:1.25rem}.pi-detail-dialog{max-width:min(700px,100%);max-height:calc(100vh - 32px);overflow-y:auto}.pi-detail-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.pi-detail-section{margin-top:18px;padding-top:14px;border-top:1px solid var(--pc-color-border)}.pi-detail-section-title{margin:0 0 10px;font-size:12px;font-weight:650}.pi-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.pi-detail-value{min-width:0;padding:8px 10px;border-radius:var(--pc-radius-md);background:var(--pc-color-surface-raised)}.pi-detail-value span,.pi-detail-field>span{display:block;color:var(--pc-color-text-muted);font-size:10px}.pi-detail-value strong{display:block;margin-top:3px;color:var(--pc-color-text);font-size:12px;font-weight:550;overflow-wrap:anywhere}.pi-detail-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pi-detail-field{display:flex;flex-direction:column;gap:5px;min-width:0}.pi-detail-field--wide{grid-column:1/-1}.pi-detail-select{max-width:none}.pi-status-select{width:100%}.pi-detail-input{height:36px}.pi-detail-textarea{width:100%;min-width:0;resize:vertical;padding:8px 10px;border:1px solid var(--pc-color-border-strong);border-radius:var(--pc-radius-md);background:var(--pc-color-surface);color:var(--pc-color-text);font:inherit;font-size:12px}.pi-detail-textarea:focus{border-color:var(--pc-color-primary);box-shadow:var(--pc-focus-ring);outline:none}.pi-detail-textarea:disabled,.pi-detail-input:disabled,.pi-detail-select:disabled{opacity:.6}.pi-detail-history{display:flex;flex-direction:column;gap:8px}.pi-detail-history-item{padding:8px 10px;border-radius:var(--pc-radius-md);background:var(--pc-color-surface-raised)}.pi-detail-history-item strong{font-size:11px}.pi-detail-history-item span{float:right;color:var(--pc-color-text-muted);font-size:10px}.pi-detail-history-item p{margin:4px 0 0;color:var(--pc-color-text-secondary);font-size:11px;overflow-wrap:anywhere}.pi-dialog-title{color:var(--pc-color-text);font-size:1rem;font-weight:650;margin:0}.pi-dialog-description{color:var(--pc-color-text-secondary);font-size:var(--pc-font-size-sm);line-height:1.6;margin:0.5rem 0 0}.pi-dialog-actions{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1.25rem}/* Variables declaration */
.rdp-root {
  --rdp-accent-color: blue; /* The accent color used for selected days and UI elements. */
  --rdp-accent-background-color: #f0f0ff; /* The accent background color used for selected days and UI elements. */

  --rdp-day-height: 44px; /* The height of the day cells. */
  --rdp-day-width: 44px; /* The width of the day cells. */

  --rdp-day_button-border-radius: 100%; /* The border radius of the day cells. */
  --rdp-day_button-border: 2px solid transparent; /* The border of the day cells. */
  --rdp-day_button-height: 42px; /* The height of the day cells. */
  --rdp-day_button-width: 42px; /* The width of the day cells. */

  --rdp-selected-border: 2px solid var(--rdp-accent-color); /* The border of the selected days. */
  --rdp-disabled-opacity: 0.5; /* The opacity of the disabled days. */
  --rdp-outside-opacity: 0.75; /* The opacity of the days outside the current month. */
  --rdp-today-color: var(--rdp-accent-color); /* The color of the today's date. */

  --rdp-dropdown-gap: 0.5rem; /* The gap between the dropdowns used in the month captons. */

  --rdp-months-gap: 2rem; /* The gap between the months in the multi-month view. */

  --rdp-nav_button-disabled-opacity: 0.5; /* The opacity of the disabled navigation buttons. */
  --rdp-nav_button-height: 2.25rem; /* The height of the navigation buttons. */
  --rdp-nav_button-width: 2.25rem; /* The width of the navigation buttons. */
  --rdp-nav-height: 2.75rem; /* The height of the navigation bar. */

  --rdp-range_middle-background-color: var(--rdp-accent-background-color); /* The color of the background for days in the middle of a range. */
  --rdp-range_middle-color: inherit; /* The color of the range text. */

  --rdp-range_start-color: white; /* The color of the range text. */
  --rdp-range_start-background: linear-gradient(
    var(--rdp-gradient-direction),
    transparent 50%,
    var(--rdp-range_middle-background-color) 50%
  ); /* Used for the background of the start of the selected range. */
  --rdp-range_start-date-background-color: var(--rdp-accent-color); /* The background color of the date when at the start of the selected range. */

  --rdp-range_end-background: linear-gradient(
    var(--rdp-gradient-direction),
    var(--rdp-range_middle-background-color) 50%,
    transparent 50%
  ); /* Used for the background of the end of the selected range. */
  --rdp-range_end-color: white; /* The color of the range text. */
  --rdp-range_end-date-background-color: var(--rdp-accent-color); /* The background color of the date when at the end of the selected range. */

  --rdp-week_number-border-radius: 100%; /* The border radius of the week number. */
  --rdp-week_number-border: 2px solid transparent; /* The border of the week number. */

  --rdp-week_number-height: var(--rdp-day-height); /* The height of the week number cells. */
  --rdp-week_number-opacity: 0.75; /* The opacity of the week number. */
  --rdp-week_number-width: var(--rdp-day-width); /* The width of the week number cells. */
  --rdp-weeknumber-text-align: center; /* The text alignment of the weekday cells. */

  --rdp-weekday-opacity: 0.75; /* The opacity of the weekday. */
  --rdp-weekday-padding: 0.5rem 0rem; /* The padding of the weekday. */
  --rdp-weekday-text-align: center; /* The text alignment of the weekday cells. */

  --rdp-gradient-direction: 90deg;

  --rdp-animation_duration: 0.3s;
  --rdp-animation_timing: cubic-bezier(0.4, 0, 0.2, 1);
}

.rdp-root[dir="rtl"] {
  --rdp-gradient-direction: -90deg;
}

.rdp-root[data-broadcast-calendar="true"] {
  --rdp-outside-opacity: unset;
}

/* Root of the component. */
.rdp-root {
  position: relative; /* Required to position the navigation toolbar. */
  box-sizing: border-box;
}

.rdp-root * {
  box-sizing: border-box;
}

.rdp-day {
  width: var(--rdp-day-width);
  height: var(--rdp-day-height);
  text-align: center;
}

.rdp-day_button {
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  justify-content: center;
  align-items: center;
  display: flex;

  width: var(--rdp-day_button-width);
  height: var(--rdp-day_button-height);
  border: var(--rdp-day_button-border);
  border-radius: var(--rdp-day_button-border-radius);
}

.rdp-day_button:disabled {
  cursor: revert;
}

.rdp-caption_label {
  z-index: 1;

  position: relative;
  display: inline-flex;
  align-items: center;

  white-space: nowrap;
  border: 0;
}

.rdp-dropdown:focus-visible ~ .rdp-caption_label {
  outline: 5px auto Highlight;
  /* biome-ignore lint/suspicious/noDuplicateProperties: backward compatibility */
  outline: 5px auto -webkit-focus-ring-color;
}

.rdp-button_next,
.rdp-button_previous {
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  -moz-appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  appearance: none;

  width: var(--rdp-nav_button-width);
  height: var(--rdp-nav_button-height);
}

.rdp-button_next:disabled,
.rdp-button_next[aria-disabled="true"],
.rdp-button_previous:disabled,
.rdp-button_previous[aria-disabled="true"] {
  cursor: revert;

  opacity: var(--rdp-nav_button-disabled-opacity);
}

.rdp-chevron {
  display: inline-block;
  fill: var(--rdp-accent-color);
}

.rdp-root[dir="rtl"] .rdp-nav .rdp-chevron {
  transform: rotate(180deg);
  transform-origin: 50%;
}

.rdp-dropdowns {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--rdp-dropdown-gap);
}
.rdp-dropdown {
  z-index: 2;

  /* Reset */
  opacity: 0;
  appearance: none;
  position: absolute;
  inset-block-start: 0;
  inset-block-end: 0;
  inset-inline-start: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  cursor: inherit;
  border: none;
  line-height: inherit;
}

.rdp-dropdown_root {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.rdp-dropdown_root[data-disabled="true"] .rdp-chevron {
  opacity: var(--rdp-disabled-opacity);
}

.rdp-month_caption {
  display: flex;
  align-content: center;
  height: var(--rdp-nav-height);
  font-weight: bold;
  font-size: large;
}

.rdp-root[data-nav-layout="around"] .rdp-month,
.rdp-root[data-nav-layout="after"] .rdp-month {
  position: relative;
}

.rdp-root[data-nav-layout="around"] .rdp-month_caption {
  justify-content: center;
  margin-inline-start: var(--rdp-nav_button-width);
  margin-inline-end: var(--rdp-nav_button-width);
  position: relative;
}

.rdp-root[data-nav-layout="around"] .rdp-button_previous {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  height: var(--rdp-nav-height);
  display: inline-flex;
}

.rdp-root[data-nav-layout="around"] .rdp-button_next {
  position: absolute;
  inset-inline-end: 0;
  top: 0;
  height: var(--rdp-nav-height);
  display: inline-flex;
  justify-content: center;
}

.rdp-months {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--rdp-months-gap);
  max-width: fit-content;
}

.rdp-month_grid {
  border-collapse: collapse;
}

.rdp-nav {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;

  display: flex;
  align-items: center;

  height: var(--rdp-nav-height);
}

.rdp-weekday {
  opacity: var(--rdp-weekday-opacity);
  padding: var(--rdp-weekday-padding);
  font-weight: 500;
  font-size: smaller;
  text-align: var(--rdp-weekday-text-align);
  text-transform: var(--rdp-weekday-text-transform);
}

.rdp-week_number {
  opacity: var(--rdp-week_number-opacity);
  font-weight: 400;
  font-size: small;
  height: var(--rdp-week_number-height);
  width: var(--rdp-week_number-width);
  border: var(--rdp-week_number-border);
  border-radius: var(--rdp-week_number-border-radius);
  text-align: var(--rdp-weeknumber-text-align);
}

/* DAY MODIFIERS */
.rdp-today:not(.rdp-outside) {
  color: var(--rdp-today-color);
}

.rdp-selected {
  font-weight: bold;
  font-size: large;
}

.rdp-selected .rdp-day_button {
  border: var(--rdp-selected-border);
}

.rdp-outside {
  opacity: var(--rdp-outside-opacity);
}

.rdp-disabled:not(.rdp-selected) {
  opacity: var(--rdp-disabled-opacity);
}

.rdp-hidden {
  visibility: hidden;
  color: var(--rdp-range_start-color);
}

.rdp-range_start {
  background: var(--rdp-range_start-background);
}

.rdp-range_start .rdp-day_button {
  background-color: var(--rdp-range_start-date-background-color);
  color: var(--rdp-range_start-color);
}

.rdp-range_middle {
  background-color: var(--rdp-range_middle-background-color);
}

.rdp-range_middle .rdp-day_button {
  border: unset;
  border-radius: unset;
  color: var(--rdp-range_middle-color);
}

.rdp-range_end {
  background: var(--rdp-range_end-background);
  color: var(--rdp-range_end-color);
}

.rdp-range_end .rdp-day_button {
  color: var(--rdp-range_start-color);
  background-color: var(--rdp-range_end-date-background-color);
}

.rdp-range_start.rdp-range_end {
  background: revert;
}

.rdp-focusable {
  cursor: pointer;
}

@keyframes rdp-slide_in_left {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes rdp-slide_in_right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes rdp-slide_out_left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes rdp-slide_out_right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.rdp-weeks_before_enter {
  animation: rdp-slide_in_left var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-weeks_before_exit {
  animation: rdp-slide_out_left var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-weeks_after_enter {
  animation: rdp-slide_in_right var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-weeks_after_exit {
  animation: rdp-slide_out_right var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-root[dir="rtl"] .rdp-weeks_after_enter {
  animation: rdp-slide_in_left var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-root[dir="rtl"] .rdp-weeks_before_exit {
  animation: rdp-slide_out_right var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-root[dir="rtl"] .rdp-weeks_before_enter {
  animation: rdp-slide_in_right var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-root[dir="rtl"] .rdp-weeks_after_exit {
  animation: rdp-slide_out_left var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

@keyframes rdp-fade_in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes rdp-fade_out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.rdp-caption_after_enter {
  animation: rdp-fade_in var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-caption_after_exit {
  animation: rdp-fade_out var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-caption_before_enter {
  animation: rdp-fade_in var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}

.rdp-caption_before_exit {
  animation: rdp-fade_out var(--rdp-animation_duration)
    var(--rdp-animation_timing) forwards;
}
.cn-date-picker{position:relative;display:inline-flex}.cn-date-picker-trigger{font-weight:400;justify-content:flex-start;min-width:13rem}.cn-date-picker-placeholder{color:var(--pc-color-text-muted)}.cn-date-picker-popup{position:absolute;top:calc(100% + 6px);left:0;z-index:90;background:var(--pc-color-surface);border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);box-shadow:var(--pc-shadow-menu);color:var(--pc-color-text);padding:0.75rem}.cn-date-picker-popup .rdp-root{--rdp-accent-color:var(--pc-color-primary);--rdp-accent-background-color:var(--pc-color-primary-subtle);--rdp-day-height:2.25rem;--rdp-day-width:2.25rem;--rdp-day_button-height:2rem;--rdp-day_button-width:2rem;--rdp-selected-border:1px solid var(--pc-color-primary);--rdp-today-color:var(--pc-color-primary);font-family:var(--pc-font-sans)}.cn-date-picker-popup .rdp-month_caption{color:var(--pc-color-text);font-size:0.8125rem;font-weight:600}.cn-date-picker-popup .rdp-weekday{color:var(--pc-color-text-muted);font-size:0.6875rem;font-weight:500}.cn-date-picker-popup .rdp-day_button{border-radius:var(--pc-radius-sm);color:var(--pc-color-text-secondary);font:inherit}.cn-date-picker-popup .rdp-day_button:hover:not(:disabled){background:var(--pc-color-neutral-bg)}.cn-date-picker-popup .rdp-selected .rdp-day_button{color:var(--pc-color-primary-foreground)}.cn-date-picker-popup .rdp-today:not(.rdp-outside) .rdp-day_button{font-weight:700}.cn-date-picker-popup .rdp-disabled{color:var(--pc-color-text-muted)}@media(max-width:480px){.pi-detail-grid,.pi-detail-form{grid-template-columns:1fr}.pi-detail-field--wide{grid-column:auto}}@media(max-width:360px){.pc-intake{padding:10px}.pi-card{padding:10px}.pi-meta{grid-template-columns:1fr}.pi-group-count{max-width:90px;text-align:right}}
`

function text(value) { return value == null ? '' : String(value).trim() }
function normalize(value) { return text(value).replace(/[\s\u00a0]/g, '').toLowerCase() }
function column(headers, aliases) { const names = new Set(aliases.map(normalize)); return headers.findIndex(header => names.has(normalize(header))) }
function field(row, headers, aliases) { const index = column(headers, aliases); return index < 0 ? '' : text(row[index]) }
function fieldWithFallbackColumn(row, headers, aliases, fallbackIndex) {
  const index = column(headers, aliases)
  return text(row[index >= 0 ? index : fallbackIndex])
}
function parseSheet(name, worksheet, t) {
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false, blankrows: false })
  const headerIndex = rows.findIndex((row, index) => index < 15 && column(row.map(text), ['请购单号', '请购单编号', '申请单号']) >= 0 && column(row.map(text), ['物料名称', '商品名称']) >= 0)
  if (headerIndex < 0) throw new Error(`noHeader:${name}`)
  const originalHeaders = rows[headerIndex].map(text)
  const headers = originalHeaders.map((header, index) => header || t('rowName').replace('{index}', String(index + 1)))
  const baseRows = rows.slice(headerIndex + 1).map((row, offset) => {
    const sourceRowNumber = headerIndex + offset + 2
    const requisitionNo = field(row, headers, ['请购单号', '请购单编号', '申请单号'])
    const procurementOrg = field(row, headers, ['采购组织']) || text(row[13])
    const lineNo = field(row, headers, ['行号', '明细行号', '请购单行号'])
    const materialCode = field(row, headers, ['物料编码', '物料代码', '存货编码'])
    const materialName = field(row, headers, ['物料名称', '商品名称'])
    const identity = requisitionNo && (materialCode || materialName) ? [normalize(requisitionNo), normalize(lineNo), normalize(materialCode || materialName)].join('|') : `row:${sourceRowNumber}`
    const sourceFields = {}
    headers.forEach((header, index) => { if (normalize(header) !== normalize('预计发货时间')) { const key = Object.hasOwn(sourceFields, header) ? `${header}__${index + 1}` : header; sourceFields[key] = text(row[index]) } })
    const reviewReason = !requisitionNo ? 'missing:requisitionNo' : !materialName ? 'missing:materialName' : ''
    return {
      identity, sourceRowNumber, requisitionNo, procurementOrg, lineNo, materialCode, materialName,
      materialCategory: field(row, headers, ['物料分类', '物料类别']),
      specification: field(row, headers, ['规格', '规格型号']), model: field(row, headers, ['型号']), unit: field(row, headers, ['主单位', '单位']),
      quantity: field(row, headers, ['主数量', '请购数量', '数量']), demandDate: field(row, headers, ['需求日期']), suggestedOrderDate: field(row, headers, ['建议订货日期']),
      remainingQuantity: field(row, headers, ['未到货数量']), purchaseOrderNo: field(row, headers, ['订单号', '采购订单号']), supplier: field(row, headers, ['供应商']),
      sourceFields, buyerEtaFromFile: field(row, headers, ['预计发货时间']), expectedShipAt: '', reviewReason,
    }
  }).filter(row => Object.values(row.sourceFields).some(Boolean) || row.requisitionNo || row.materialName || row.buyerEtaFromFile)
  const occurrences = new Map(), totals = new Map()
  baseRows.forEach(row => totals.set(row.identity, (totals.get(row.identity) || 0) + 1))
  const lines = baseRows.map(row => {
    const occurrence = occurrences.get(row.identity) || 0; occurrences.set(row.identity, occurrence + 1)
    const identityKey = row.identity.startsWith('row:') ? row.identity : `${row.identity}#${occurrence + 1}`
    const duplicate = (totals.get(row.identity) || 0) > 1
    return { ...row, id: identityKey, identityKey, isMine: false, confirmedAt: null, confirmationBatchId: null, notes: '', needsReview: Boolean(row.reviewReason) || duplicate, reviewReason: row.reviewReason || (duplicate ? 'duplicateIdentity' : ''), sourceFileName: '', importedAt: '', orderStatus: '', nextAction: '', waitingOn: '', activityLog: [] }
  })
  return { name, headers: originalHeaders.filter(Boolean), lines, warningCount: lines.filter(row => row.needsReview).length }
}
function parseWorkbook(buffer, t) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, dense: false })
  if (!workbook.SheetNames.length) throw new Error('noSheets')
  const parsed = [], failures = []
  for (const name of workbook.SheetNames) { try { const sheet = parseSheet(name, workbook.Sheets[name], t); if (sheet.lines.length) parsed.push(sheet) } catch (error) { failures.push(error instanceof Error ? error.message : `noHeader:${name}`) } }
  if (!parsed.length) throw new Error(failures[0] || 'noRows')
  return parsed
}
function numericValue(value) {
  const match = String(value ?? '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : null
}
function uniqueRowText(row) { return [...new Set(row.map(text).filter(Boolean))] }
function valueAfterLabel(values, pattern) {
  const index = values.findIndex(value => pattern.test(value))
  if (index < 0) return ''
  return values.slice(index + 1).find(value => !pattern.test(value) && !/^(产品交付|其他约定|付款期限|甲方|乙方)$/.test(value)) || ''
}
function parsePurchaseOrderWorkbook(buffer, fileName) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, dense: false })
  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '', raw: false, blankrows: false })
    const executionHeaderIndex = rows.findIndex(row => {
      const headers = row.map(text)
      return column(headers, ['请购单号', '请购单编号']) >= 0
        && column(headers, ['订单号', '采购订单号', '采购订单编号']) >= 0
        && column(headers, ['采购组织']) >= 0
        && column(headers, ['物料名称']) >= 0
    })
    if (executionHeaderIndex >= 0) {
      const headers = rows[executionHeaderIndex].map(text)
      const grouped = new Map()
      let skippedRows = 0
      const distinct = values => [...new Set(values.map(text).filter(Boolean))]
      const addDistinct = (current, value) => distinct([...(current ? current.split('、') : []), value]).join('、')
      for (let index = executionHeaderIndex + 1; index < rows.length; index += 1) {
        const row = rows[index]
        if (!row.some(value => text(value))) continue
        const requisitionNo = fieldWithFallbackColumn(row, headers, ['请购单号', '请购单编号'], 0)
        if (requisitionNo === '合计') continue
        const orderNo = fieldWithFallbackColumn(row, headers, ['订单号', '采购订单号', '采购订单编号'], 19)
        const name = field(row, headers, ['物料名称'])
        if (orderNo && !requisitionNo) {
          throw new Error(`第 ${index + 1} 行有订单号但没有请购单号，请检查 Excel 的 A 列。`)
        }
        if (!orderNo || !name) { skippedRows += 1; continue }
        const procurementOrg = field(row, headers, ['采购组织'])
        const inventoryOrg = field(row, headers, ['库存组织'])
        const requisitionType = field(row, headers, ['请购类型'])
        const preparer = field(row, headers, ['制单人'])
        const supplier = field(row, headers, ['供应商'])
        const orderDate = field(row, headers, ['订单日期'])
        const deliveryAddress = field(row, headers, ['收货地址'])
        const project = field(row, headers, ['项目'])
        const procurementOfficer = field(row, headers, ['采购员'])
        const procurementDepartment = field(row, headers, ['采购部门'])
        let order = grouped.get(orderNo)
        if (!order) {
          order = {
            orderNo, orderDate, buyer: procurementOrg, supplier, inventoryOrg, requisitionType, preparer,
            requisitionNos: [], procurementOrg, procurementOfficer, procurementDepartment, project,
            taxInclusiveTotal: null, taxExclusiveTotal: null, taxRate: '', items: [],
            deliveryAddress, recipient: '', recipientPhone: '', deliveryTime: '', paymentTerms: [],
            otherTerms: [], clauses: [], sourceFileName: fileName,
          }
          grouped.set(orderNo, order)
        }
        order.orderDate ||= orderDate
        order.supplier ||= supplier
        order.buyer ||= procurementOrg
        order.procurementOrg = addDistinct(order.procurementOrg, procurementOrg)
        order.inventoryOrg = addDistinct(order.inventoryOrg, inventoryOrg)
        order.requisitionType = addDistinct(order.requisitionType, requisitionType)
        order.preparer = addDistinct(order.preparer, preparer)
        order.procurementOfficer = addDistinct(order.procurementOfficer, procurementOfficer)
        order.procurementDepartment = addDistinct(order.procurementDepartment, procurementDepartment)
        order.project = addDistinct(order.project, project)
        order.deliveryAddress = addDistinct(order.deliveryAddress, deliveryAddress)
        if (requisitionNo && !order.requisitionNos.includes(requisitionNo)) order.requisitionNos.push(requisitionNo)
        const specification = distinct([field(row, headers, ['规格']), field(row, headers, ['型号'])]).join(' / ')
        const requisitionQuantity = numericValue(field(row, headers, ['主数量']))
        const orderedQuantity = numericValue(field(row, headers, ['订货主数量']))
        order.items.push({
          sequence: field(row, headers, ['行号']), name, specification,
          quantity: orderedQuantity ?? requisitionQuantity, unit: field(row, headers, ['主单位']),
          taxInclusiveUnitPrice: null, taxExclusiveUnitPrice: null, amount: null,
          requisitionNo, lineNo: field(row, headers, ['行号']), materialCode: field(row, headers, ['物料编码']),
          materialCategory: field(row, headers, ['物料分类']), inventoryOrg, requisitionType, preparer,
          procurementOrg, lineRemark: field(row, headers, ['行备注']),
          sourceDocumentNo: field(row, headers, ['源头单据号']), sourceDocumentLineNo: field(row, headers, ['源头单据行号']),
          requisitionQuantity, orderedQuantity,
          demandDate: field(row, headers, ['需求日期']), suggestedOrderDate: field(row, headers, ['建议订货日期']),
          expectedArrivalDate: field(row, headers, ['计划到货日期']), arrivalDate: field(row, headers, ['到货日期']),
          receivedQuantity: numericValue(field(row, headers, ['到货主数量'])),
          returnedQuantity: numericValue(field(row, headers, ['退货主数量'])),
          remainingQuantity: numericValue(field(row, headers, ['未到货数量'])),
          stockInDate: field(row, headers, ['入库日期']), customer: field(row, headers, ['客户']),
          stockInQuantity: numericValue(field(row, headers, ['入库主数量'])),
          returnedStockQuantity: numericValue(field(row, headers, ['退库主数量'])),
          replenishmentQuantity: numericValue(field(row, headers, ['补货主数量'])),
          unexecutedCloseQuantity: numericValue(field(row, headers, ['未执行关闭数量'])),
          requisitionLineClosed: field(row, headers, ['请购单行关闭标识']),
          procurementOfficer, procurementDepartment, project, deliveryAddress,
        })
      }
      const orders = [...grouped.values()].map(order => ({
        ...order,
        requisitionNos: distinct([
          ...order.requisitionNos,
          ...order.items.map(item => item.requisitionNo),
        ]),
      }))
      return { orders, skippedRows }
    }
    const orderRow = rows.findIndex(row => row.some(value => /订单编号/.test(text(value))))
    const headerRow = rows.findIndex(row => row.some(value => /序号/.test(text(value))) && row.some(value => /产品名称/.test(text(value))) && row.some(value => /^数量$/.test(text(value))))
    if (orderRow < 0 || headerRow < 0) continue
    const orderNoLabelIndex = rows[orderRow].findIndex(value => /订单编号/.test(text(value)))
    const orderNo = text(rows[orderRow].slice(orderNoLabelIndex + 1).find(value => text(value)))
    if (!orderNo) throw new Error(`订单编号缺失：${fileName}`)
    const headers = rows[headerRow].map(text)
    const itemColumn = (pattern) => headers.findIndex(value => pattern.test(value))
    const sequenceColumn = itemColumn(/序号/), nameColumn = itemColumn(/产品名称/)
    const specificationColumns = headers.map((value, index) => /品牌|型号|规格/.test(value) ? index : -1).filter(index => index >= 0)
    const quantityColumn = itemColumn(/^数量$/), unitColumn = itemColumn(/^单位$/), taxInclusivePriceColumn = itemColumn(/含税单价/), taxExclusivePriceColumn = itemColumn(/不含税单价/), amountColumn = itemColumn(/金额/)
    const items = []
    for (let index = headerRow + 1; index < rows.length; index += 1) {
      const row = rows[index]
      const sequence = text(row[sequenceColumn])
      const name = text(row[nameColumn])
      const quantity = numericValue(row[quantityColumn])
      if (!name || quantity == null || !sequence || !/^\d+$/.test(sequence)) continue
      items.push({ sequence, name, specification: [...new Set(specificationColumns.map(columnIndex => text(row[columnIndex])).filter(Boolean))].join(' / '), quantity, unit: text(row[unitColumn]), taxInclusiveUnitPrice: numericValue(row[taxInclusivePriceColumn]), taxExclusiveUnitPrice: numericValue(row[taxExclusivePriceColumn]), amount: numericValue(row[amountColumn]) })
    }
    if (!items.length) throw new Error(`没有识别到商品明细：${fileName}`)
    const clauses = []
    const paymentTerms = [], otherTerms = []
    let deliveryAddress = '', recipient = '', recipientPhone = '', deliveryTime = '', buyer = '', supplier = '', orderDate = ''
    let taxInclusiveTotal = null, taxExclusiveTotal = null, taxRate = ''
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index], values = uniqueRowText(row), line = values.join(' ')
      if (/合计金额/.test(line)) {
        const amounts = [...line.matchAll(/(?:￥|¥|CNY)?\s*(-?\d[\d,]*(?:\.\d+)?)/g)].map(match => Number(match[1].replace(/,/g, ''))).filter(Number.isFinite)
        if (amounts.length >= 2) { taxInclusiveTotal = amounts[0]; taxExclusiveTotal = amounts[1] }
        taxRate = line.match(/\d+(?:\.\d+)?\s*%/)?.[0] || ''
      }
      if (/付款期限/.test(line)) { const clause = values.slice(1).join(' ').trim(); if (clause && !paymentTerms.includes(clause)) paymentTerms.push(clause); clauses.push({ section: '付款', text: clause || line }) }
      else if (/产品交付/.test(line)) { const clause = values.slice(1).join(' ').trim(); if (clause && !otherTerms.includes(clause)) otherTerms.push(clause); clauses.push({ section: '交付', text: clause || line }) }
      else if (/其他约定|发票/.test(line)) { const clause = values.slice(1).join(' ').trim(); if (clause && !otherTerms.includes(clause)) otherTerms.push(clause); clauses.push({ section: '其他约定', text: clause || line }) }
      if (/交付地点/.test(line)) deliveryAddress = valueAfterLabel(values, /交付地点/) || deliveryAddress
      if (/收货人姓名/.test(line)) recipient = valueAfterLabel(values, /收货人姓名/) || recipient
      if (/收货人电话/.test(line)) recipientPhone = valueAfterLabel(values, /收货人电话/) || recipientPhone
      if (/交付时间/.test(line)) deliveryTime = valueAfterLabel(values, /交付时间/) || deliveryTime
      if (/甲方/.test(line) && !buyer) buyer = valueAfterLabel(values, /甲方/) || ''
      if (/乙方/.test(line) && !supplier) supplier = valueAfterLabel(values, /乙方/) || ''
      if (/日期/.test(line) && !orderDate) orderDate = values.find(value => /\d{4}[-/.年]\d{1,2}/.test(value)) || ''
    }
    return { orders: [{ orderNo, orderDate, buyer, supplier, taxInclusiveTotal, taxExclusiveTotal, taxRate, items, deliveryAddress, recipient, recipientPhone, deliveryTime, paymentTerms, otherTerms, clauses, sourceFileName: fileName }], skippedRows: 0 }
  }
  throw new Error(`未识别到采购订单模板：${fileName}`)
}
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

const PENDING_QUERY_FIELD_IDS = ['materialName', 'materialCode', 'materialCategory', 'specification', 'requisitionNo', 'lineNo', 'quantity', 'demandDate', 'review']
const MINE_QUERY_FIELD_IDS = ['materialName', 'materialCode', 'materialCategory', 'specification', 'requisitionNo', 'procurementOrg', 'lineNo', 'quantity', 'remainingQuantity', 'purchaseOrderNo', 'supplier', 'orderStatus', 'demandDate', 'expectedShipAt', 'notes', 'confirmedAt']
const MINE_COLUMN_SETTINGS_KEY = 'hilda:dsh-procurement-intake:procurement.owned-lines:columns:v2'
const ORDER_QUERY_FIELD_IDS = ['orderNo', 'purchaseOrderStatus', 'orderDate', 'buyer', 'supplier', 'itemNames', 'itemCount', 'itemQuantity', 'inventoryOrg', 'requisitionType', 'preparer', 'requisitionNos', 'procurementOrg', 'procurementOfficer', 'procurementDepartment', 'project', 'materialCategory', 'expectedArrivalDate', 'arrivalDate', 'receivedQuantity', 'returnedQuantity', 'remainingQuantity', 'stockInDate', 'stockInQuantity', 'returnedStockQuantity', 'replenishmentQuantity', 'unexecutedCloseQuantity', 'requisitionLineClosed', 'sourceDocumentNo', 'sourceDocumentLineNo', 'lineRemark', 'requisitionQuantity', 'orderedQuantity', 'demandDate', 'suggestedOrderDate', 'customer', 'taxInclusiveTotal', 'taxExclusiveTotal', 'taxRate', 'deliveryAddress', 'recipient', 'recipientPhone', 'deliveryTime', 'paymentTerms', 'sourceFileName', 'importedAt']
const ORDER_COLUMN_SETTINGS_KEY = 'hilda:dsh-procurement-intake:procurement.purchase-orders:columns:v1'
const ORDER_REPORT_VISIBLE_COLUMNS = ['requisitionNos', 'procurementOrg', 'inventoryOrg', 'expectedArrivalDate', 'arrivalDate', 'receivedQuantity', 'remainingQuantity', 'procurementOfficer', 'procurementDepartment']
const ORDER_REPORT_HIDDEN_LEGACY_COLUMNS = ['buyer', 'itemCount', 'taxInclusiveTotal', 'taxExclusiveTotal', 'taxRate', 'recipient', 'recipientPhone', 'deliveryTime', 'paymentTerms']

class IntakeErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[procurement] render error:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const message = this.state.error instanceof Error ? this.state.error.message : String(this.state.error)
    return h('main', { className: 'pc-intake' },
      h('section', { className: 'pi-card pi-error-screen', role: 'alert' },
        h('h1', { className: 'pi-title' }, '采购工作台暂时无法显示'),
        h('p', { className: 'pi-help' }, '插件捕获到界面异常，详细信息已写入浏览器 Console。可以尝试重新载入此区域。'),
        h('pre', { className: 'pi-error-detail' }, message),
        h('button', { type: 'button', className: 'pi-button', onClick: () => this.setState({ error: null }) }, '重新载入')))
  }
}

function IntakeBody({ t, data, sessionId }) {
  const selectPortalRef = React.useRef(null)
  React.useEffect(() => {
    const root = selectPortalRef.current
    if (!root) return
    let frame = 0
    let hoverTimer = 0
    let activeCell = null
    const tooltip = document.createElement('div')
    tooltip.className = 'pi-cell-tooltip'
    tooltip.setAttribute('role', 'tooltip')
    tooltip.setAttribute('aria-hidden', 'true')
    document.body.appendChild(tooltip)
    const hideTooltip = () => {
      window.clearTimeout(hoverTimer)
      activeCell = null
      tooltip.classList.remove('is-visible')
      tooltip.setAttribute('aria-hidden', 'true')
    }
    const showTooltip = cell => {
      if (!cell?.classList.contains('is-truncated-tooltip')) return
      activeCell = cell
      tooltip.textContent = cell.getAttribute('data-tooltip-content') || ''
      tooltip.classList.add('is-visible')
      tooltip.setAttribute('aria-hidden', 'false')
      const cellRect = cell.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      const left = Math.max(8, Math.min(cellRect.left, window.innerWidth - tooltipRect.width - 8))
      const below = cellRect.bottom + tooltipRect.height + 8 <= window.innerHeight
      const top = below ? cellRect.bottom + 6 : Math.max(8, cellRect.top - tooltipRect.height - 6)
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    }
    const handlePointerOver = event => {
      const cell = event.target instanceof Element ? event.target.closest('td.is-truncated-tooltip') : null
      if (!cell || !root.contains(cell) || cell === activeCell) return
      window.clearTimeout(hoverTimer)
      hoverTimer = window.setTimeout(() => showTooltip(cell), 120)
    }
    const handlePointerOut = event => {
      if (activeCell && !activeCell.contains(event.relatedTarget)) hideTooltip()
      else if (!activeCell) window.clearTimeout(hoverTimer)
    }
    const updateTruncatedCellTooltips = () => {
      root.querySelectorAll('.ai-table-plugin td').forEach(cell => {
        const content = cell.querySelector('.pi-copy-cell-text') || cell
        const source = cell.getAttribute('data-tooltip-content') || content.textContent?.trim()
        if (!source) return
        if (cell.hasAttribute('title')) cell.removeAttribute('title')
        if (cell.hasAttribute('data-tooltip')) cell.removeAttribute('data-tooltip')
        const isTruncated = content.scrollWidth > content.clientWidth + 1
        if (isTruncated) {
          if (cell.getAttribute('data-tooltip-content') !== source) cell.setAttribute('data-tooltip-content', source)
          if (!cell.classList.contains('is-truncated-tooltip')) cell.classList.add('is-truncated-tooltip')
        } else {
          if (cell.hasAttribute('data-tooltip-content')) cell.removeAttribute('data-tooltip-content')
          if (cell.classList.contains('is-truncated-tooltip')) cell.classList.remove('is-truncated-tooltip')
        }
      })
    }
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateTruncatedCellTooltips)
    }
    const mutations = new MutationObserver(scheduleUpdate)
    mutations.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['title', 'style'] })
    root.addEventListener('pointerover', handlePointerOver)
    root.addEventListener('pointerout', handlePointerOut)
    document.addEventListener('scroll', hideTooltip, true)
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(hoverTimer)
      mutations.disconnect()
      root.removeEventListener('pointerover', handlePointerOver)
      root.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('scroll', hideTooltip, true)
      window.removeEventListener('resize', scheduleUpdate)
      tooltip.remove()
    }
  }, [])
  const [store, setStore] = React.useState({ pendingRows: [], mineRows: [], pendingContextRows: [], pendingTotal: 0, mineTotal: 0, pendingFilteredTotal: 0, mineFilteredTotal: 0, pendingRequisitionCount: 0, pendingFilteredRequisitionCount: 0, latestImport: null })
  React.useLayoutEffect(() => {
    try {
      const saved = window.localStorage.getItem(MINE_COLUMN_SETTINGS_KEY)
      if (!saved) return
      const state = JSON.parse(saved)
      if (!state || !Array.isArray(state.visible) || state.visible.includes('procurementOrg')) return
      const order = Array.isArray(state.order) ? [...state.order] : []
      if (!order.includes('procurementOrg')) {
        const requisitionIndex = order.indexOf('requisitionNo')
        order.splice(requisitionIndex >= 0 ? requisitionIndex + 1 : order.length, 0, 'procurementOrg')
      }
      window.localStorage.setItem(MINE_COLUMN_SETTINGS_KEY, JSON.stringify({ ...state, order, visible: [...state.visible, 'procurementOrg'] }))
    } catch {}
  }, [])
  React.useLayoutEffect(() => {
    try {
      const saved = window.localStorage.getItem(ORDER_COLUMN_SETTINGS_KEY)
      if (!saved) return
      const state = JSON.parse(saved)
      if (!state || !Array.isArray(state.visible) || state.procurementExecutionColumnsVersion >= 1) return
      const order = Array.isArray(state.order) ? [...state.order] : []
      let insertionIndex = order.indexOf('orderNo') + 1
      if (insertionIndex === 0) insertionIndex = order.length
      const visible = new Set(state.visible)
      ORDER_REPORT_HIDDEN_LEGACY_COLUMNS.forEach(fieldId => visible.delete(fieldId))
      for (const fieldId of ORDER_REPORT_VISIBLE_COLUMNS) {
        if (!order.includes(fieldId)) order.splice(insertionIndex++, 0, fieldId)
        visible.add(fieldId)
      }
      window.localStorage.setItem(ORDER_COLUMN_SETTINGS_KEY, JSON.stringify({ ...state, order, visible: [...visible], procurementExecutionColumnsVersion: 1 }))
    } catch {}
  }, [])
  const [menu, setMenu] = React.useState('requests')
  const [masterDataType, setMasterDataType] = React.useState(null)
  const [masterDataRows, setMasterDataRows] = React.useState([])
  const [masterDataSelected, setMasterDataSelected] = React.useState(new Set())
  const [masterDataLoading, setMasterDataLoading] = React.useState(false)
  const [masterDataOverviewCount, setMasterDataOverviewCount] = React.useState(null)
  const [masterDataOverviewLoading, setMasterDataOverviewLoading] = React.useState(false)
  const [masterDataSaving, setMasterDataSaving] = React.useState(false)
  const [masterDataDraft, setMasterDataDraft] = React.useState(null)
  const [orderRows, setOrderRows] = React.useState([])
  const [orderCount, setOrderCount] = React.useState(0)
  const [workspaceSummary, setWorkspaceSummary] = React.useState(null)
  const [workspaceLoading, setWorkspaceLoading] = React.useState(false)
  const [workspaceError, setWorkspaceError] = React.useState('')
  const [workspaceTodoDialogOpen, setWorkspaceTodoDialogOpen] = React.useState(false)
  const [workspaceTodoSaving, setWorkspaceTodoSaving] = React.useState(new Set())
  const [orderView, setOrderView] = React.useState('manage')
  const [orderPage, setOrderPage] = React.useState(1)
  const [orderPageSize, setOrderPageSize] = React.useState(10)
  const [orderLoading, setOrderLoading] = React.useState(false)
  const [notifyingOrders, setNotifyingOrders] = React.useState(false)
  const [syncingPurchaseOrders, setSyncingPurchaseOrders] = React.useState(false)
  const [orderSelected, setOrderSelected] = React.useState(new Set())
  const [orderDetailRow, setOrderDetailRow] = React.useState(null)
  const [orderDetailDraft, setOrderDetailDraft] = React.useState(null)
  const [editingOrderDetails, setEditingOrderDetails] = React.useState(false)
  const [savingOrderDetails, setSavingOrderDetails] = React.useState(false)
  const [orderPreview, setOrderPreview] = React.useState([])
  const [orderPreviewSelected, setOrderPreviewSelected] = React.useState(new Set())
  const [orderFileErrors, setOrderFileErrors] = React.useState([])
  const [orderDuplicateCount, setOrderDuplicateCount] = React.useState(0)
  const [orderSkippedRows, setOrderSkippedRows] = React.useState(0)
  const orderTableQuery = React.useRef({ filters: [], sorts: [] })
  const orderFileInputRef = React.useRef(null)
  const [modelOptions, setModelOptions] = React.useState({ models: [], reasoningEfforts: [] })
  const [modelSettings, setModelSettings] = React.useState({ model: 'deepseek-flash', reasoningEffort: 'off' })
  const loadModelSettings = React.useCallback(async () => {
    try {
      const [options, settings] = await Promise.all([data.listModelOptions(), data.getModelSettings()])
      setModelOptions(options)
      setModelSettings(settings)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    }
  }, [data])
  React.useEffect(() => { void loadModelSettings() }, [loadModelSettings])
  async function saveModelSettings() {
    try {
      await data.updateModelSettings(modelSettings.model, modelSettings.reasoningEffort)
      setSuccess(t('settingsSaved'))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    }
  }
  const refreshMasterData = React.useCallback(async () => {
    setMasterDataLoading(true)
    try {
      const result = await data.listMasterData(masterDataType)
      setMasterDataRows((result.rows || []).filter(row => String(row?.name ?? '').trim()))
      setMasterDataSelected(new Set())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
    } finally {
      setMasterDataLoading(false)
    }
  }, [data, masterDataType])
  const refreshMasterDataOverview = React.useCallback(async () => {
    setMasterDataOverviewLoading(true)
    try {
      const lists = await Promise.all(['suppliers', 'materials', 'materialCategories'].map(type => data.listMasterData(type)))
      setMasterDataOverviewCount(lists.reduce((count, result) => count + (result.rows || []).filter(row => String(row?.name ?? '').trim()).length, 0))
    } catch (caught) {
      setMasterDataOverviewCount(-1)
      setError(caught instanceof Error ? caught.message : String(caught))
    } finally {
      setMasterDataOverviewLoading(false)
    }
  }, [data])
  React.useEffect(() => {
    if (menu === 'masterData' && masterDataType) void refreshMasterData()
  }, [masterDataType, menu, refreshMasterData])
  React.useEffect(() => {
    if (menu === 'masterData' && !masterDataType && masterDataOverviewCount === null) void refreshMasterDataOverview()
  }, [masterDataOverviewCount, masterDataType, menu, refreshMasterDataOverview])
  function openMasterDataType(type) {
    setMasterDataType(type)
    setMasterDataRows([])
    setMasterDataLoading(true)
    setMasterDataSelected(new Set())
    setMasterDataDraft(null)
  }
  async function saveMasterRecord() {
    if (!masterDataDraft || masterDataSaving) return
    setMasterDataSaving(true); setError(''); setSuccess('')
    try {
      await data.saveMasterData(masterDataType, masterDataDraft)
      setMasterDataDraft(null)
      setSuccess(t('masterSaved'))
      await refreshMasterData()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setMasterDataSaving(false) }
  }
  async function changeMasterDataStatus(ids, status) {
    if (!ids.length) return
    setMasterDataLoading(true); setError(''); setSuccess('')
    try {
      const result = await data.setMasterDataStatus(masterDataType, ids, status)
      setMasterDataSelected(new Set())
      setSuccess(t('masterStatusUpdated').replace('{count}', String(result.updatedCount)))
      await refreshMasterData()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setMasterDataLoading(false) }
  }
  async function deleteMasterRecords(ids) {
    if (!ids.length || !window.confirm(t('masterDeleteConfirm').replace('{count}', String(ids.length)))) return
    setMasterDataLoading(true); setError(''); setSuccess('')
    try {
      const result = await data.deleteMasterData(masterDataType, ids)
      setMasterDataSelected(new Set())
      setSuccess(t('masterDeleted').replace('{count}', String(result.deletedCount)))
      await refreshMasterData()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setMasterDataLoading(false) }
  }
  const [requestView, setRequestView] = React.useState('intake')
  const [pendingPage, setPendingPage] = React.useState(1)
  const [minePage, setMinePage] = React.useState(1)
  const [pendingPageSize, setPendingPageSize] = React.useState(10)
  const [minePageSize, setMinePageSize] = React.useState(10)
  const [pendingLoading, setPendingLoading] = React.useState(false)
  const [mineLoading, setMineLoading] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [fileName, setFileName] = React.useState('')
  const [sheets, setSheets] = React.useState([])
  const [sheetIndex, setSheetIndex] = React.useState(0)
  const [selected, setSelected] = React.useState(new Set())
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  React.useEffect(() => {
    if (!success) return
    const timer = window.setTimeout(() => setSuccess(''), 4000)
    return () => window.clearTimeout(timer)
  }, [success])
  const [parsing, setParsing] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const [mineSelected, setMineSelected] = React.useState(new Set())
  const [shipDate, setShipDate] = React.useState(undefined)
  const [shipDialogOpen, setShipDialogOpen] = React.useState(false)
  const [supplierDialogOpen, setSupplierDialogOpen] = React.useState(false)
  const [batchSupplierDraft, setBatchSupplierDraft] = React.useState('')
  const [savingBatchSupplier, setSavingBatchSupplier] = React.useState(false)
  const detailDialogOverlayRef = React.useRef(null)
  const [detailRow, setDetailRow] = React.useState(null)
  const [detailDraft, setDetailDraft] = React.useState(null)
  const [savingDetail, setSavingDetail] = React.useState(false)
  const fileInputRef = React.useRef(null)
  const listRequestIds = React.useRef({ pending: 0, mine: 0 })
  const keywordRef = React.useRef(query)
  const previousKeyword = React.useRef(query)
  const pendingTableQuery = React.useRef({ filters: [], sorts: [] })
  const mineTableQuery = React.useRef({ filters: [], sorts: [] })
  const words = keywords(query), sheet = sheets[sheetIndex]
  const pending = store.pendingRows
  const mine = store.mineRows
  const candidates = pending
  const copyText = async rawValue => {
    const value = rawValue == null ? '' : String(rawValue).trim()
    if (!value || value === '—') return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const input = document.createElement('textarea')
        input.value = value
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        const copied = document.execCommand('copy')
        input.remove()
        if (!copied) throw new Error('Clipboard copy was rejected')
      }
      setError('')
      setSuccess('')
      window.requestAnimationFrame(() => setSuccess(t('copySuccess')))
    } catch (copyError) {
      setError(t('copyFailed'))
    }
  }
  const copyCell = (rawValue, label, detail = false) => {
    const value = Array.isArray(rawValue) ? rawValue.filter(Boolean).join('、') : rawValue == null ? '' : String(rawValue).trim()
    if (!value || value === '—') return h('span', { className: 'pi-cell pi-cell--muted' }, '—')
    return h('button', {
      type: 'button',
      className: `pi-copy-cell${detail ? ' pi-detail-copy-cell' : ''}`,
      'aria-label': `${t('copy')} ${label}: ${value}`,
      onClick: event => { event.stopPropagation(); void copyText(value) },
    }, h(Copy, { size: 14, strokeWidth: 1.8, className: 'pi-copy-cell-icon', 'aria-hidden': true }), h('span', { className: 'pi-copy-cell-text' }, value))
  }
  const selectedCount = selected.size
  const requisitionCount = store.pendingRequisitionCount

  const loadPage = React.useCallback(async (status, requestedPage, requestedPageSize) => {
    const requestId = ++listRequestIds.current[status]
    const setLoading = status === 'pending' ? setPendingLoading : setMineLoading
    setLoading(true)
    try {
      const tableQuery = status === 'pending' ? pendingTableQuery.current : mineTableQuery.current
      const sorts = tableQuery.sorts
      const sort = sorts.length > 1 ? sorts : sorts[0]
      const request = { status, page: requestedPage, pageSize: requestedPageSize, sort, filters: tableQuery.filters, keywords: status === 'pending' ? keywordRef.current : '' }
      const value = await data.list(request.status, request.page, request.pageSize, request.sort, request.filters, request.keywords)
      if (requestId !== listRequestIds.current[status]) return value
      if (status === 'pending') {
        setPendingPage(value.page)
        setStore(current => ({ ...current, pendingRows: value.rows || [], pendingContextRows: value.contextRows || [], pendingTotal: value.statusCount ?? value.count ?? value.rows?.length ?? 0, pendingFilteredTotal: value.count ?? value.rows?.length ?? 0, pendingRequisitionCount: value.requisitionCount, pendingFilteredRequisitionCount: value.matchingRequisitionCount, latestImport: value.latestImport || null }))
      } else {
        setMinePage(value.page)
        setStore(current => ({ ...current, mineRows: value.rows || [], mineTotal: value.statusCount ?? value.count ?? value.rows?.length ?? 0, mineFilteredTotal: value.count ?? value.rows?.length ?? 0, latestImport: value.latestImport || null }))
        setDetailRow(current => current ? (value.rows || []).find(row => row.id === current.id) || current : current)
      }
      return value
    } catch (caught) {
      if (requestId === listRequestIds.current[status]) setError(caught instanceof Error ? caught.message : String(caught))
      throw caught
    } finally {
      if (requestId === listRequestIds.current[status]) setLoading(false)
    }
  }, [data])
  const refresh = React.useCallback(async () => {
    await Promise.all([
      loadPage('pending', pendingPage, pendingPageSize),
      loadPage('mine', minePage, minePageSize),
    ])
  }, [loadPage, minePage, minePageSize, pendingPage, pendingPageSize])
  const loadWorkspaceSummary = React.useCallback(async () => {
    setWorkspaceLoading(true)
    setWorkspaceError('')
    try {
      const summary = await data.workspaceSummary(30)
      setWorkspaceSummary(summary)
    } catch (caught) {
      setWorkspaceError(caught instanceof Error ? caught.message : t('dashboardLoadError'))
    } finally {
      setWorkspaceLoading(false)
    }
  }, [data, t])
  const setWorkspaceTodoRead = React.useCallback(async (todoId, isRead) => {
    setWorkspaceTodoSaving(previous => new Set(previous).add(todoId))
    try {
      await data.setWorkspaceTodosRead([todoId], isRead)
      await loadWorkspaceSummary()
    } catch (caught) {
      setWorkspaceError(caught instanceof Error ? caught.message : t('todoReadUpdateError'))
    } finally {
      setWorkspaceTodoSaving(previous => { const next = new Set(previous); next.delete(todoId); return next })
    }
  }, [data, loadWorkspaceSummary, t])
  React.useEffect(() => {
    if (menu === 'workspace') void loadWorkspaceSummary()
  }, [menu, loadWorkspaceSummary])
  React.useEffect(() => {
    void Promise.all([
      loadPage('pending', 1, 10),
      loadPage('mine', 1, 10),
    ]).catch(() => {})
  }, [loadPage])
  React.useEffect(() => {
    if (previousKeyword.current === query) return
    previousKeyword.current = query
    setSelected(new Set())
    setPendingPage(1)
    const timer = setTimeout(() => { void loadPage('pending', 1, pendingPageSize).catch(() => {}) }, 250)
    return () => clearTimeout(timer)
  }, [loadPage, pendingPageSize, query])

  function updateTableQuery(status, queryState) {
    const target = status === 'pending' ? pendingTableQuery : mineTableQuery
    target.current = queryState
    if (status === 'pending') setPendingPage(1)
    else setMinePage(1)
    void loadPage(status, 1, status === 'pending' ? pendingPageSize : minePageSize).catch(() => {})
  }

  function changePage(status, page) {
    if (status === 'pending') {
      setPendingPage(page)
      void loadPage(status, page, pendingPageSize).catch(() => {})
    } else {
      setMinePage(page)
      void loadPage(status, page, minePageSize).catch(() => {})
    }
  }
  function changePageSize(status, pageSize) {
    if (status === 'pending') {
      setPendingPageSize(pageSize); setPendingPage(1)
      void loadPage(status, 1, pageSize).catch(() => {})
    } else {
      setMinePageSize(pageSize); setMinePage(1)
      void loadPage(status, 1, pageSize).catch(() => {})
    }
  }
  function refreshTable(status) {
    const page = status === 'pending' ? pendingPage : minePage
    const pageSize = status === 'pending' ? pendingPageSize : minePageSize
    void loadPage(status, page, pageSize).catch(() => {})
  }

  async function loadOrders(page = orderPage, pageSize = orderPageSize) {
    setOrderLoading(true)
    try {
      const query = orderTableQuery.current
      const sorts = query.sorts || []
      const sort = sorts.length > 1 ? sorts : sorts[0]
      const result = await data.listPurchaseOrders(page, pageSize, sort, query.filters || [])
      setOrderRows(result.rows || [])
      setOrderCount(result.count || 0)
      setOrderPage(result.page || page)
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)) }
    finally { setOrderLoading(false) }
  }
  function orderDraftFrom(row) {
    return {
      orderNo: row.orderNo || '', purchaseOrderStatus: row.purchaseOrderStatus || '待通知供应商', orderDate: row.orderDate || '',
      procurementOrg: row.procurementOrg || row.buyer || '', inventoryOrg: row.inventoryOrg || uniqueOrderItemValues(row, 'inventoryOrg'),
      supplier: row.supplier || '', requisitionType: row.requisitionType || uniqueOrderItemValues(row, 'requisitionType'),
      preparer: row.preparer || uniqueOrderItemValues(row, 'preparer'), procurementOfficer: row.procurementOfficer || uniqueOrderItemValues(row, 'procurementOfficer'),
      procurementDepartment: row.procurementDepartment || uniqueOrderItemValues(row, 'procurementDepartment'), project: row.project || uniqueOrderItemValues(row, 'project'),
      taxInclusiveTotal: row.taxInclusiveTotal == null ? '' : String(row.taxInclusiveTotal), taxExclusiveTotal: row.taxExclusiveTotal == null ? '' : String(row.taxExclusiveTotal),
      taxRate: row.taxRate || '', deliveryAddress: row.deliveryAddress || '', recipient: row.recipient || '', recipientPhone: row.recipientPhone || '', deliveryTime: row.deliveryTime || '',
    }
  }
  function openOrderDetails(row) {
    setOrderDetailRow(row)
    setOrderDetailDraft(orderDraftFrom(row))
    setEditingOrderDetails(false)
    setError('')
  }
  async function saveOrderDetails() {
    if (!orderDetailRow || !orderDetailDraft || savingOrderDetails) return
    setSavingOrderDetails(true); setError('')
    try {
      const updates = {
        ...orderDetailDraft,
        taxInclusiveTotal: orderDetailDraft.taxInclusiveTotal === '' ? null : Number(orderDetailDraft.taxInclusiveTotal),
        taxExclusiveTotal: orderDetailDraft.taxExclusiveTotal === '' ? null : Number(orderDetailDraft.taxExclusiveTotal),
      }
      const saved = await data.updatePurchaseOrder(orderDetailRow.id, updates)
      setOrderDetailRow(saved); setOrderDetailDraft(orderDraftFrom(saved)); setEditingOrderDetails(false)
      setSuccess(t('orderInfoSaved'))
      await Promise.all([loadOrders(orderPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setSavingOrderDetails(false) }
  }
  React.useEffect(() => { if (menu === 'orders') void loadOrders(orderPage) }, [menu])

  async function chooseOrderFiles(fileList) {
    const files = [...(fileList || [])].filter(file => /\.xlsx?$/i.test(file.name))
    setError(''); setSuccess(''); setOrderPreview([]); setOrderPreviewSelected(new Set()); setOrderFileErrors([]); setOrderDuplicateCount(0); setOrderSkippedRows(0)
    if (!files.length) { setError(t('folderNoExcel')); return }
    setParsing(true)
    const parsed = [], failures = []
    let skippedRows = 0
    try {
      for (const file of files) {
        const filePath = file.webkitRelativePath || file.name
        if (file.size > 20 * 1024 * 1024) { failures.push(`${filePath}：${t('fileSizeError')}`); continue }
        try {
          const result = await parsePurchaseOrderWorkbook(await file.arrayBuffer(), filePath)
          parsed.push(...result.orders)
          skippedRows += result.skippedRows || 0
        }
        catch (caught) { failures.push(`${filePath}：${caught instanceof Error ? caught.message : t('fileReadError')}`) }
      }
      const existing = new Set()
      const pageSize = 100
      let page = 1, count = 0
      do {
        const result = await data.listPurchaseOrders(page, pageSize)
        count = result.count || 0
        for (const order of result.rows || []) existing.add(normalize(order.orderNo))
        page += 1
      } while ((page - 1) * pageSize < count)

      const seen = new Set(existing)
      let duplicateCount = 0
      const uniqueOrders = parsed.filter(order => {
        const key = normalize(order.orderNo)
        if (seen.has(key)) { duplicateCount += 1; return false }
        seen.add(key)
        return true
      })
      setOrderPreview(uniqueOrders); setOrderPreviewSelected(new Set()); setOrderDuplicateCount(duplicateCount); setOrderFileErrors(failures); setOrderSkippedRows(skippedRows)
      if (!uniqueOrders.length && duplicateCount) setSuccess(t('allOrdersDuplicate').replace('{count}', String(duplicateCount)))
      else if (!uniqueOrders.length && skippedRows) setSuccess(t('skippedOrderRows').replace('{count}', String(skippedRows)))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('saveError'))
    } finally { setParsing(false) }
  }
  async function importOrders(importAll = false) {
    const ordersToImport = importAll ? orderPreview : orderPreview.filter(order => orderPreviewSelected.has(normalize(order.orderNo)))
    if (!ordersToImport.length || importing) return
    const importedOrderNos = new Set(ordersToImport.map(order => normalize(order.orderNo)))
    setImporting(true); setError('')
    try {
      const result = await data.importPurchaseOrders(ordersToImport)
      const remainingOrders = orderPreview.filter(order => !importedOrderNos.has(normalize(order.orderNo)))
      setOrderPreview(remainingOrders); setOrderPreviewSelected(new Set())
      if (!remainingOrders.length) {
        setOrderDuplicateCount(0)
        if (!orderFileErrors.length) setOrderView('manage')
      }
      setSuccess(`${t('orderImportSuccess')}：新增 ${result.importedCount} 张，重复跳过 ${result.skippedCount} 张 · ${t('masterDataImportedSummary').replace('{count}', String(result.masterDataCreatedCount || 0))}`)
      await Promise.all([loadOrders(1), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setImporting(false) }
  }

  async function deleteOrders(ids) {
    const uniqueIds = [...new Set(ids)]
    if (!uniqueIds.length || !window.confirm(`${t('deleteOrdersConfirm')} (${uniqueIds.length})`)) return
    setError(''); setSuccess('')
    try {
      const result = await data.deletePurchaseOrders(uniqueIds)
      setOrderSelected(new Set())
      setSuccess(`已删除 ${result.deletedCount} 张采购订单`)
      const nextPage = orderRows.length === uniqueIds.length && orderPage > 1 ? orderPage - 1 : orderPage
      await Promise.all([loadOrders(nextPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
  }

  async function cancelOrder(id) {
    const order = orderRows.find(item => item.id === id)
    if (!order || order.purchaseOrderStatus === '取消了采购订单') return
    if (!window.confirm(t('cancelOrderConfirm'))) return
    setError(''); setSuccess('')
    try {
      await data.cancelPurchaseOrders([id])
      setSuccess(t('cancelOrderSuccess'))
      await Promise.all([loadOrders(orderPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
  }

  async function notifySelectedOrders() {
    const ids = [...orderSelected]
    if (!ids.length || notifyingOrders || !window.confirm(t('notifyOrdersConfirm').replace('{count}', String(ids.length)))) return
    setNotifyingOrders(true); setError(''); setSuccess('')
    try {
      const result = await data.notifyPurchaseOrders(ids)
      setOrderSelected(new Set())
      setSuccess(t('notifyOrdersSuccess').replace('{count}', String(result.notifiedCount)))
      await Promise.all([loadOrders(orderPage), loadPage('mine', minePage, minePageSize)])
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setNotifyingOrders(false) }
  }

  async function syncPurchaseOrderNumbers() {
    if (syncingPurchaseOrders) return
    setSyncingPurchaseOrders(true); setError(''); setSuccess('')
    try {
      const result = await data.syncOwnedPurchaseOrderNumbers()
      setSuccess(t('syncPurchaseOrdersResult')
        .replace('{count}', String(result.updatedRequisitionCount))
        .replace('{lines}', String(result.updatedCount))
        .replace('{unmatched}', String(result.unmatchedRequisitionCount)))
      await refresh()
    } catch (caught) { setError(caught instanceof Error ? caught.message : t('saveError')) }
    finally { setSyncingPurchaseOrders(false) }
  }

  function updateOrderTableQuery(queryState) {
    orderTableQuery.current = queryState
    setOrderSelected(new Set())
    void loadOrders(1).catch(() => {})
  }

  function chooseFile(file) {
    if (!file) return
    setError(''); setSuccess(''); setFileName(file.name); setSheets([]); setSheetIndex(0)
    if (!/\.xlsx?$/i.test(file.name)) { setError(t('fileTypeError')); return }
    if (file.size > 20 * 1024 * 1024) { setError(t('fileSizeError')); return }
    setParsing(true)
    file.arrayBuffer().then(buffer => { const parsed = parseWorkbook(buffer, t); setSheets(parsed); setSheetIndex(Math.max(0, parsed.findIndex(item => item.lines.length > 0))) })
      .catch(caught => setError(errorText(caught instanceof Error ? caught.message : '', t))).finally(() => setParsing(false))
  }
  async function claim() {
    const ids = [...selected]
    if (!ids.length) return
    try {
      await data.claim(ids)
      setSelected(new Set()); setRequestView('mine'); setSuccess(''); setError('')
      await refresh()
    } catch { setError(t('saveError')) }
  }
  async function doImport() {
    if (!sheet || importing) return
    setImporting(true); setError(''); setSuccess('')
    try {
      const result = await data.importLines(sheet.lines, fileName, sheet.name)
      setSheets([]); setSelected(new Set()); keywordRef.current = ''; previousKeyword.current = ''; setQuery(''); setError('')
      setSuccess(`${t('imported')} ${sheet.lines.length} ${t('lines')} · ${t('added')} ${result.importedCount} · ${t('updated')} ${result.updatedCount} · ${t('masterDataImportedSummary').replace('{count}', String(result.masterDataCreatedCount || 0))}`)
      await refresh()
    } catch { setError(t('saveError')) }
    finally { setImporting(false) }
  }
  async function clearPending() {
    if (!window.confirm(t('clearPendingConfirm'))) return
    try {
      await data.clearPending()
      setSelected(new Set()); keywordRef.current = ''; previousKeyword.current = ''; setQuery(''); setPendingPage(1); setError(''); setSuccess('')
      await refresh()
    } catch { setError(t('saveError')) }
  }
  async function deleteOwned(id) {
    if (!window.confirm(t('deleteConfirm'))) return
    try {
      await data.deleteOwned([id])
      setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }
  function openDetails(row) {
    setDetailRow(row)
    setDetailDraft({
      supplier: row.supplier || '',
      expectedShipAt: row.expectedShipAt || row.buyerEtaFromFile || '',
      nextAction: row.nextAction || '',
      waitingOn: row.waitingOn || '',
      notes: row.notes || '',
    })
    setError('')
  }
  async function saveDetails() {
    if (!detailRow || !detailDraft || savingDetail) return
    setSavingDetail(true)
    setError('')
    try {
      const saved = await data.updateLine(detailRow.id, detailDraft)
      setDetailRow(saved)
      setDetailDraft({ supplier: saved.supplier || '', expectedShipAt: saved.expectedShipAt || saved.buyerEtaFromFile || '', nextAction: saved.nextAction || '', waitingOn: saved.waitingOn || '', notes: saved.notes || '' })
      setSuccess(t('detailSaved'))
      await loadPage('mine', minePage, minePageSize)
      setDetailRow(null)
      setDetailDraft(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('saveError'))
    } finally {
      setSavingDetail(false)
    }
  }
  async function saveShip(row, value) {
    const next = text(value)
    if (next === text(row.expectedShipAt || row.buyerEtaFromFile)) return
    try {
      await data.updateLine(row.id, { expectedShipAt: next })
      setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }
  const toggle = (id, checked) => setSelected(previous => { const next = new Set(previous); checked ? next.add(id) : next.delete(id); return next })
  const toggleMine = (id, checked) => setMineSelected(previous => { const next = new Set(previous); checked ? next.add(id) : next.delete(id); return next })
  async function applyShipToSelected() {
    if (!shipDate || !mineSelected.size) return
    try {
      const shipValue = format(shipDate, 'yyyy-MM-dd')
      for (const id of mineSelected) await data.updateLine(id, { expectedShipAt: shipValue })
      setMineSelected(new Set()); setShipDate(undefined); setShipDialogOpen(false); setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }
  async function applySupplierToSelected() {
    if (!mineSelected.size || savingBatchSupplier) return
    const supplier = batchSupplierDraft.trim()
    if (!supplier) return
    const ids = [...mineSelected]
    setSavingBatchSupplier(true)
    setError('')
    try {
      await data.updateSuppliers(ids, supplier)
      setSupplierDialogOpen(false)
      setBatchSupplierDraft('')
      setMineSelected(new Set())
      setSuccess(t('batchSupplierSaved').replace('{count}', String(ids.length)))
      await loadPage('mine', minePage, minePageSize)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('saveError'))
    } finally {
      setSavingBatchSupplier(false)
    }
  }
  async function deleteSelected() {
    if (!mineSelected.size) return
    if (!window.confirm(t('deleteConfirm'))) return
    try {
      await data.deleteOwned([...mineSelected])
      setMineSelected(new Set()); setError(''); await refresh()
    } catch { setError(t('saveError')) }
  }

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

  const aiAdapter = React.useMemo(() => createAiAdapter(data, sessionId), [data, sessionId])
  const pendingDefinition = React.useMemo(() => defineAITable({
    id: 'procurement.pending-lines', rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter },
    fields: [
      { id: 'materialName', label: t('material'), type: 'text', accessor: 'materialName', render: value => copyCell(value, t('material')), width: 210 },
      { id: 'materialCode', label: t('materialCode'), type: 'text', accessor: 'materialCode', render: value => copyCell(value, t('materialCode')), width: 140 },
      { id: 'materialCategory', label: t('materialCategory'), type: 'text', accessor: 'materialCategory', width: 120 },
      { id: 'specification', label: t('spec'), type: 'text', read: row => [row.specification, row.model].filter(Boolean).join(' · '), width: 150 },
      { id: 'requisitionNo', label: t('requisitionNo'), type: 'text', accessor: 'requisitionNo', render: value => copyCell(value, t('requisitionNo')), width: 210 },
      { id: 'procurementOrg', label: t('procurementOrg'), type: 'text', read: row => row.procurementOrg || row.sourceFields?.['采购组织'] || row.sourceFields?.['未命名列14'] || row.sourceFields?.['Unnamed column 14'] || '', render: value => copyCell(value, t('procurementOrg')), width: 190 },
      { id: 'lineNo', label: t('lineNo'), type: 'text', accessor: 'lineNo', width: 90 },
      { id: 'quantity', label: t('quantity'), type: 'number', read: row => Number(row.quantity) || 0, format: (_value, row) => qty(row), width: 100 },
      { id: 'demandDate', label: t('expectedDate'), type: 'date', accessor: 'demandDate', width: 120 },
      { id: 'sameRequisitionContext', label: t('context'), type: 'text', read: row => words.length ? store.pendingContextRows.filter(item => item.requisitionNo === row.requisitionNo && item.id !== row.id) : [], render: value => value.length ? h('details', null, h('summary', null, `${t('context')} · ${value.length}（${t('contextOnly')}）`), h('div', { className: 'pi-list' }, ...value.map(row => h('div', { key: row.id, className: 'pi-line pi-line--context' }, h('p', { className: 'pi-material' }, row.materialName || t('material')), h('p', { className: 'pi-help' }, [row.materialCode, row.specification, row.model].filter(Boolean).join(' · ')))))) : '—', filterable: false, groupable: false, sortable: false, colorable: false, aiReadable: false, width: 220 },
      { id: 'review', label: t('review'), type: 'tag', read: row => row.needsReview ? t('review') : '', groupable: true, width: 95 },
    ],
  }), [t, pending, query, store.pendingContextRows])
  const pendingSelection = Object.fromEntries([...selected].map(id => [id, true]))
  const pendingSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => selected.has(row.id)), onChange: event => setSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.id) : next.delete(row.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => h('input', { className: 'pi-check', type: 'checkbox', checked: selected.has(row.original.id), onChange: event => toggle(row.original.id, event.target.checked), 'aria-label': `选择 ${row.original.materialName || row.original.requisitionNo}` }),
  }
  const candidateSection = store.pendingTotal > 0 ? h('section', { className: 'pi-card', 'aria-label': t('candidates') },
    h(AIDataTable, {
      definition: pendingDefinition, rows: candidates, storageScope: 'hilda:dsh-procurement-intake',
      defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
      columnSettings: { storageKey: 'hilda:dsh-procurement-intake:procurement.pending-lines:columns:v2' },
      loading: pendingLoading,
      onRefresh: () => refreshTable('pending'),
      page: pendingPage, pageSize: pendingPageSize, onPageChange: page => changePage('pending', page),
      onPageSizeChange: pageSize => changePageSize('pending', pageSize), total: store.pendingFilteredTotal,
      onQueryChange: queryState => updateTableQuery('pending', queryState),
      queryFieldIds: PENDING_QUERY_FIELD_IDS,
      getRowId: row => row.id, rowSelection: pendingSelection,
      onRowSelectionChange: selection => setSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
      leadingColumns: [pendingSelectColumn], emptyText: emptyStateContent(t('notFound'), t('tryShorter'), { compact: true }),
    })) : h('div', { className: 'pi-card pi-empty' }, emptyStateContent('暂无待筛选明细', '先导入 NC 请购单。'))

  const mineDefinition = React.useMemo(() => defineAITable({
    id: 'procurement.owned-lines', rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter },
    fields: [
      { id: 'materialName', label: t('materialInfo'), type: 'text', accessor: 'materialName', render: value => copyCell(value, t('material')), width: 210 },
      { id: 'materialCode', label: t('materialCode'), type: 'text', accessor: 'materialCode', render: value => copyCell(value, t('materialCode')), width: 140 },
      { id: 'materialCategory', label: t('materialCategory'), type: 'text', accessor: 'materialCategory', width: 120 },
      { id: 'specification', label: t('spec'), type: 'text', read: row => [row.specification, row.model].filter(Boolean).join(' · '), width: 150 },
      { id: 'requisitionNo', label: t('requisitionNo'), type: 'text', accessor: 'requisitionNo', render: value => copyCell(value, t('requisitionNo')), width: 210 },
      { id: 'procurementOrg', label: t('procurementOrg'), type: 'text', read: row => row.procurementOrg || row.sourceFields?.['采购组织'] || row.sourceFields?.['未命名列14'] || row.sourceFields?.['Unnamed column 14'] || '', render: value => copyCell(value, t('procurementOrg')), width: 190 },
      { id: 'lineNo', label: t('lineNo'), type: 'text', accessor: 'lineNo', width: 90 },
      { id: 'quantity', label: t('quantity'), type: 'number', read: row => Number(row.quantity) || 0, format: (_value, row) => qty(row), width: 90 },
      { id: 'remainingQuantity', label: t('remainingQuantity'), type: 'number', read: row => Number(row.remainingQuantity) || 0, format: (_value, row) => row.remainingQuantity ? `${row.remainingQuantity}${row.unit ? ' ' + row.unit : ''}` : '—', width: 120 },
      { id: 'purchaseOrderNo', label: t('purchaseOrder'), type: 'text', accessor: 'purchaseOrderNo', render: value => copyCell(value, t('purchaseOrder')), width: 180 },
      { id: 'supplier', label: t('supplier'), type: 'text', accessor: 'supplier', render: value => copyCell(value, t('supplier')), width: 180 },
      { id: 'orderStatus', label: t('orderStatus'), type: 'tag', read: row => row.orderStatus || (row.isMine ? t('unmatchedPurchaseOrder') : ''), render: (_value, row) => orderStatusBadge({ ...row, orderStatus: row.orderStatus || (row.isMine ? t('unmatchedPurchaseOrder') : '') }), width: 145 },
      { id: 'demandDate', label: t('expectedDate'), type: 'date', accessor: 'demandDate', width: 120 },
      { id: 'expectedShipAt', label: t('expectedShip'), type: 'date', read: row => row.expectedShipAt || row.buyerEtaFromFile || '', width: 130 },
      { id: 'notes', label: t('notes'), type: 'text', accessor: 'notes', width: 180 },
      { id: 'confirmedAt', label: t('claimedAt'), type: 'datetime', read: row => formatDateTime(row.confirmedAt), width: 145 },
    ],
  }), [t])
  const mineSelection = Object.fromEntries([...mineSelected].map(id => [id, true]))
  const mineSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => mineSelected.has(row.id)), onChange: event => setMineSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.id) : next.delete(row.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => h('input', { className: 'pi-check', type: 'checkbox', checked: mineSelected.has(row.original.id), onChange: event => toggleMine(row.original.id, event.target.checked), 'aria-label': `选择 ${row.original.materialName || row.original.requisitionNo}` }),
  }
  const renderRowActionMenu = (label, items) => {
    const MenuRoot = DropdownMenu.Root
    const MenuTrigger = DropdownMenu.Trigger
    const MenuPortal = DropdownMenu.Portal
    const MenuContent = DropdownMenu.Content
    const MenuItem = DropdownMenu.Item
    return h(MenuRoot, null,
      h(MenuTrigger, { asChild: true }, h('button', { type: 'button', className: 'pi-order-menu-trigger', 'aria-label': label }, '⋯')),
      h(MenuPortal, null, h(MenuContent, { className: 'pi-order-action-menu', side: 'bottom', align: 'end', sideOffset: 4 },
        ...items.map(item => h(MenuItem, {
          key: item.label,
          className: `pi-order-action-menu-item${item.danger ? ' pi-order-action-menu-item--danger' : ''}`,
          disabled: item.disabled,
          onSelect: item.onSelect,
        }, item.label)))))
  }
  const mineActionColumn = {
    id: 'actions', size: 64, enableSorting: false, enableHiding: false, meta: { sticky: 'right' },
    header: () => t('orderActions'), cell: ({ row }) => renderRowActionMenu(t('orderActions'), [
      { label: t('viewDetails'), onSelect: () => openDetails(row.original) },
      { label: t('delete'), danger: true, onSelect: () => deleteOwned(row.original.id) },
    ]),
  }
  const mineSection = h('section', { className: 'pi-card' },
    h('div', { className: 'pi-table-toolbar' },
      h('h2', { className: 'pi-section-title' }, t('myRequests')),
      h('span', { className: 'pi-table-total' }, t('tableTotal').replace('{count}', String(store.mineFilteredTotal)))),
    store.mineTotal > 0 ? h(React.Fragment, null,
      h('div', { className: 'pi-batch-bar' },
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', style: { width: 'auto' }, disabled: !mineSelected.size, onClick: () => setShipDialogOpen(true) }, CALENDAR_ICON, `批量更新发货日期${mineSelected.size ? ` (${mineSelected.size})` : ''}`),
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !mineSelected.size, onClick: () => { setBatchSupplierDraft(''); setSupplierDialogOpen(true) } }, t('batchSupplier')),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--danger', disabled: !mineSelected.size, onClick: deleteSelected }, TRASH_ICON, `删除所选${mineSelected.size ? ` ${mineSelected.size} 条` : ''}`)),
      h(AIDataTable, {
        definition: mineDefinition, rows: mine, storageScope: 'hilda:dsh-procurement-intake',
        defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
        columnSettings: { storageKey: MINE_COLUMN_SETTINGS_KEY },
        loading: mineLoading,
        onRefresh: () => refreshTable('mine'),
        page: minePage, pageSize: minePageSize, onPageChange: page => changePage('mine', page),
        onPageSizeChange: pageSize => changePageSize('mine', pageSize), total: store.mineFilteredTotal,
        onQueryChange: queryState => updateTableQuery('mine', queryState),
        queryFieldIds: MINE_QUERY_FIELD_IDS,
        getRowId: row => row.id, rowSelection: mineSelection,
        onRowSelectionChange: selection => setMineSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
        leadingColumns: [mineSelectColumn], additionalColumns: [mineActionColumn], emptyText: emptyStateContent(t('noMine'), '在“待筛选”中输入物料关键词，核对命中明细后再确认归属。', { compact: true }),
      }))
      : h('div', { className: 'pi-empty' }, emptyStateContent(t('noMine'), '在“待筛选”中输入物料关键词，核对命中明细后再确认归属。')))

  const menuTitle = { workspace: t('workspace'), requests: t('requests'), orders: t('ordersMenu'), issues: t('issues'), settings: t('modelSettings'), masterData: t('masterData') }
  const placeholder = h('section', { className: 'pi-card pi-empty' }, emptyStateContent(menuTitle[menu], t('comingSoon')))
  const orderDefinition = React.useMemo(() => defineAITable({
    id: 'procurement.purchase-orders', rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter },
    fields: [
      { id: 'orderNo', label: t('orderNo'), type: 'text', accessor: 'orderNo', render: value => copyCell(value, t('orderNo')), width: 210 },
      { id: 'purchaseOrderStatus', label: t('purchaseOrderStatus'), type: 'text', read: row => row.purchaseOrderStatus || '待通知供应商', render: value => h('span', { className: `pi-badge ${value === '已通知供应商' ? 'pi-badge--ok' : value === '取消了采购订单' ? 'pi-badge--danger' : 'pi-badge--warn'}` }, value === '已通知供应商' ? t('vendorNotified') : value === '取消了采购订单' ? t('purchaseOrderCancelled') : t('pendingVendorNotice')), width: 160 },
      { id: 'requisitionNos', label: t('requisitionNos'), type: 'text', read: row => (row.requisitionNos || []).join('、') || uniqueOrderItemValues(row, 'requisitionNo'), render: value => copyCell(value, t('requisitionNos')), width: 240 },
      { id: 'procurementOrg', label: t('procurementOrg'), type: 'text', read: row => row.procurementOrg || row.buyer || uniqueOrderItemValues(row, 'procurementOrg'), render: value => copyCell(value, t('procurementOrg')), width: 220 },
      { id: 'inventoryOrg', label: t('inventoryOrg'), type: 'text', read: row => row.inventoryOrg || uniqueOrderItemValues(row, 'inventoryOrg'), width: 220 },
      { id: 'orderDate', label: t('orderDateLabel'), type: 'date', accessor: 'orderDate', width: 115 },
      { id: 'supplier', label: t('supplier'), type: 'text', accessor: 'supplier', render: value => copyCell(value, t('supplier')), width: 190 },
      { id: 'itemNames', label: t('orderItems'), type: 'text', read: row => (row.items || []).map(item => item.name).filter(Boolean).join('、'), render: value => copyCell(value, t('orderItems')), width: 260 },
      { id: 'itemCount', label: t('itemCount'), type: 'number', read: row => row.items?.length || 0, width: 90 },
      { id: 'itemQuantity', label: t('orderQuantity'), type: 'number', read: row => (row.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0), width: 100 },
      { id: 'expectedArrivalDate', label: t('expectedArrivalDate'), type: 'text', read: row => uniqueOrderItemValues(row, 'expectedArrivalDate'), width: 145 },
      { id: 'arrivalDate', label: t('arrivalDate'), type: 'text', read: row => uniqueOrderItemValues(row, 'arrivalDate'), width: 125 },
      { id: 'receivedQuantity', label: t('receivedQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'receivedQuantity'), width: 120 },
      { id: 'remainingQuantity', label: t('remainingQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'remainingQuantity'), width: 120 },
      { id: 'procurementOfficer', label: t('procurementOfficer'), type: 'text', read: row => row.procurementOfficer || uniqueOrderItemValues(row, 'procurementOfficer'), width: 115 },
      { id: 'procurementDepartment', label: t('procurementDepartment'), type: 'text', read: row => row.procurementDepartment || uniqueOrderItemValues(row, 'procurementDepartment'), width: 145 },
      { id: 'materialCategory', label: t('materialCategory'), type: 'text', read: row => uniqueOrderItemValues(row, 'materialCategory'), width: 120 },
      { id: 'requisitionType', label: t('requisitionType'), type: 'text', read: row => row.requisitionType || uniqueOrderItemValues(row, 'requisitionType'), width: 180 },
      { id: 'preparer', label: t('preparer'), type: 'text', read: row => row.preparer || uniqueOrderItemValues(row, 'preparer'), width: 110 },
      { id: 'project', label: t('project'), type: 'text', read: row => row.project || uniqueOrderItemValues(row, 'project'), width: 130 },
      { id: 'requisitionQuantity', label: t('requisitionQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'requisitionQuantity'), width: 125 },
      { id: 'orderedQuantity', label: t('orderedQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'orderedQuantity'), width: 125 },
      { id: 'demandDate', label: t('expectedDate'), type: 'date', read: row => uniqueOrderItemValues(row, 'demandDate'), width: 120 },
      { id: 'suggestedOrderDate', label: t('suggestedOrderDate'), type: 'date', read: row => uniqueOrderItemValues(row, 'suggestedOrderDate'), width: 135 },
      { id: 'returnedQuantity', label: t('returnedQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'returnedQuantity'), width: 125 },
      { id: 'stockInDate', label: t('stockInDate'), type: 'text', read: row => uniqueOrderItemValues(row, 'stockInDate'), width: 120 },
      { id: 'stockInQuantity', label: t('stockInQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'stockInQuantity'), width: 120 },
      { id: 'returnedStockQuantity', label: t('returnedStockQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'returnedStockQuantity'), width: 125 },
      { id: 'replenishmentQuantity', label: t('replenishmentQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'replenishmentQuantity'), width: 120 },
      { id: 'unexecutedCloseQuantity', label: t('unexecutedCloseQuantity'), type: 'number', read: row => sumOrderItemValues(row, 'unexecutedCloseQuantity'), width: 145 },
      { id: 'requisitionLineClosed', label: t('requisitionLineClosed'), type: 'text', read: row => uniqueOrderItemValues(row, 'requisitionLineClosed'), width: 150 },
      { id: 'sourceDocumentNo', label: t('sourceDocumentNo'), type: 'text', read: row => uniqueOrderItemValues(row, 'sourceDocumentNo'), width: 160 },
      { id: 'sourceDocumentLineNo', label: t('sourceDocumentLineNo'), type: 'text', read: row => uniqueOrderItemValues(row, 'sourceDocumentLineNo'), width: 160 },
      { id: 'lineRemark', label: t('lineRemark'), type: 'text', read: row => uniqueOrderItemValues(row, 'lineRemark'), width: 180 },
      { id: 'customer', label: t('customer'), type: 'text', read: row => uniqueOrderItemValues(row, 'customer'), width: 150 },
      { id: 'taxInclusiveTotal', label: t('orderTotal'), type: 'number', accessor: 'taxInclusiveTotal', format: value => value == null ? '—' : Number(value).toLocaleString(), width: 120 },
      { id: 'taxExclusiveTotal', label: t('taxExclusiveTotal'), type: 'number', accessor: 'taxExclusiveTotal', format: value => value == null ? '—' : Number(value).toLocaleString(), width: 120 },
      { id: 'taxRate', label: t('taxRate'), type: 'text', accessor: 'taxRate', width: 85 },
      { id: 'buyer', label: t('orderBuyer'), type: 'text', accessor: 'buyer', width: 190 },
      { id: 'deliveryAddress', label: t('deliveryAddressLabel'), type: 'text', accessor: 'deliveryAddress', width: 230 },
      { id: 'recipient', label: t('recipient'), type: 'text', accessor: 'recipient', width: 110 },
      { id: 'recipientPhone', label: t('recipientPhone'), type: 'text', accessor: 'recipientPhone', width: 135 },
      { id: 'deliveryTime', label: t('deliveryTime'), type: 'date', accessor: 'deliveryTime', width: 140 },
      { id: 'paymentTerms', label: t('paymentTerms'), type: 'text', read: row => (row.paymentTerms || []).join('；'), width: 220 },
      { id: 'sourceFileName', label: t('sourceFile'), type: 'text', accessor: 'sourceFileName', width: 250 },
      { id: 'importedAt', label: t('importedAt'), type: 'datetime', accessor: 'importedAt', width: 150 },
    ],
  }), [aiAdapter, t])
  const orderSelection = Object.fromEntries([...orderSelected].map(id => [id, true]))
  const orderSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const pageRows = table.getRowModel().rows
      return h('input', { className: 'pi-check', type: 'checkbox', checked: pageRows.length > 0 && pageRows.every(row => orderSelected.has(row.id)), onChange: event => setOrderSelected(previous => { const next = new Set(previous); pageRows.forEach(row => event.target.checked ? next.add(row.original.id) : next.delete(row.original.id)); return next }), 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => h('input', { className: 'pi-check', type: 'checkbox', checked: orderSelected.has(row.original.id), onChange: event => setOrderSelected(previous => { const next = new Set(previous); event.target.checked ? next.add(row.original.id) : next.delete(row.original.id); return next }), 'aria-label': `选择 ${row.original.orderNo}` }),
  }
  const orderActionColumn = {
    id: 'actions', size: 64, enableSorting: false, enableHiding: false, meta: { sticky: 'right' },
    header: () => t('orderActions'), cell: ({ row }) => renderRowActionMenu(t('orderActions'), [
      { label: t('viewDetails'), onSelect: () => openOrderDetails(row.original) },
      { label: t('delete'), danger: true, onSelect: () => void deleteOrders([row.original.id]) },
      { label: t('cancelOrder'), danger: true, disabled: row.original.purchaseOrderStatus === '取消了采购订单', onSelect: () => void cancelOrder(row.original.id) },
    ]),
  }
  const masterDataDefinition = React.useMemo(() => {
    const statusField = { id: 'status', label: t('masterStatus'), type: 'tag', read: row => row.status === 'enabled' ? t('enabled') : t('disabled'), render: (_value, row) => h('span', { className: `pi-badge ${row.status === 'enabled' ? 'pi-badge--ok' : 'pi-badge--muted'}` }, row.status === 'enabled' ? t('enabled') : t('disabled')), width: 100 }
    const fields = masterDataType === 'suppliers'
      ? [{ id: 'name', label: t('suppliers'), type: 'text', accessor: 'name', width: 240 }, statusField]
      : masterDataType === 'materials'
        ? [
          { id: 'code', label: t('masterCode'), type: 'text', accessor: 'code', width: 150 },
          { id: 'name', label: t('materials'), type: 'text', accessor: 'name', width: 230 },
          { id: 'category', label: t('materialCategory'), type: 'text', accessor: 'category', width: 160 },
          { id: 'specification', label: t('masterSpecification'), type: 'text', accessor: 'specification', width: 220 },
          { id: 'unit', label: t('masterUnit'), type: 'text', accessor: 'unit', width: 90 }, statusField,
        ]
        : [{ id: 'name', label: t('materialCategories'), type: 'text', accessor: 'name', width: 240 }, statusField]
    fields.push(
      { id: 'createdAt', label: t('createdAt'), type: 'text', read: row => formatDateTime(row.createdAt), width: 170 },
      { id: 'updatedAt', label: t('updatedAt'), type: 'text', read: row => formatDateTime(row.updatedAt), width: 170 },
    )
    return defineAITable({ id: `procurement.master-data.${masterDataType}`, rowKey: row => row.id, ai: { mode: 'adapter', adapter: aiAdapter }, fields })
  }, [aiAdapter, masterDataType, t])
  const masterDataSelection = Object.fromEntries([...masterDataSelected].map(id => [id, true]))
  const masterDataSelectColumn = {
    id: '__select__', size: 42, enableSorting: false, enableHiding: false,
    header: ({ table }) => {
      const visibleIds = table.getRowModel().rows.flatMap(row => row.getLeafRows().map(leaf => leaf.original.id))
      return h('input', { className: 'pi-check', type: 'checkbox', checked: visibleIds.length > 0 && visibleIds.every(id => masterDataSelected.has(id)), onClick: event => event.stopPropagation(), onChange: event => { event.stopPropagation(); setMasterDataSelected(previous => { const next = new Set(previous); visibleIds.forEach(id => event.target.checked ? next.add(id) : next.delete(id)); return next }) }, 'aria-label': t('selectAll') })
    },
    cell: ({ row }) => {
      const ids = row.getLeafRows().map(leaf => leaf.original.id)
      return h('input', { className: 'pi-check', type: 'checkbox', checked: ids.length > 0 && ids.every(id => masterDataSelected.has(id)), onClick: event => event.stopPropagation(), onChange: event => { event.stopPropagation(); setMasterDataSelected(previous => { const next = new Set(previous); ids.forEach(id => event.target.checked ? next.add(id) : next.delete(id)); return next }) }, 'aria-label': `选择 ${row.original.name || row.original.code}` })
    },
  }
  const masterDataActionColumn = {
    id: 'actions', size: 64, enableSorting: false, enableHiding: false, meta: { sticky: 'right' },
    header: () => t('orderActions'),
    cell: ({ row }) => renderRowActionMenu(t('orderActions'), [
      { label: t('editMasterRecord'), onSelect: () => setMasterDataDraft({ ...row.original }) },
      { label: row.original.status === 'enabled' ? t('disabled') : t('enabled'), onSelect: () => void changeMasterDataStatus([row.original.id], row.original.status === 'enabled' ? 'disabled' : 'enabled') },
      { label: t('delete'), danger: true, onSelect: () => void deleteMasterRecords([row.original.id]) },
    ]),
  }
  const masterDataSection = h('section', { className: 'pi-card pi-master-data-section' },
    h('div', { className: 'pi-table-toolbar' },
      h('div', null, h('h2', { className: 'pi-section-title' }, t('masterData')), h('p', { className: 'pi-help' }, t('masterDataHelp')))),
    !masterDataType ? masterDataOverviewLoading
      ? h('div', { className: 'pi-empty', role: 'status' }, h('div', { className: 'pi-empty-state-content' }, h('span', { className: 'pi-spinner', 'aria-hidden': true }), h('p', null, t('masterDataLoading'))))
      : masterDataOverviewCount === 0
        ? h('div', { className: 'pi-empty' }, emptyStateContent(t('noMasterData'), t('masterDataHelp')))
        : h('div', { className: 'pi-master-tiles' }, ...[
          ['suppliers', t('suppliers')], ['materials', t('materials')], ['materialCategories', t('materialCategories')],
        ].map(([type, label]) => h('button', { key: type, type: 'button', className: 'pi-master-tile', onClick: () => openMasterDataType(type) },
          h('span', { className: 'pi-master-tile-icon', 'aria-hidden': true }, h(type === 'suppliers' ? Building2 : type === 'materials' ? Package : Tags, { 'aria-hidden': true })),
          h('strong', null, label))))
      : h(React.Fragment, null,
        h('div', { className: 'pi-master-subnav' },
          h('button', { type: 'button', className: 'pi-master-back', onClick: () => { setMasterDataType(null); setMasterDataRows([]); setMasterDataDraft(null); setMasterDataSelected(new Set()); setMasterDataOverviewCount(null) } }, '‹'),
          ...[
          ['suppliers', t('suppliers')], ['materials', t('materials')], ['materialCategories', t('materialCategories')],
        ].map(([type, label]) => h('button', { key: type, type: 'button', className: `pi-master-subnav-item${masterDataType === type ? ' is-active' : ''}`, onClick: () => { if (masterDataType !== type) openMasterDataType(type) } }, label))),
        masterDataRows.length > 0 ? h('div', { className: 'pi-batch-bar' },
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !masterDataSelected.size || masterDataLoading, onClick: () => void changeMasterDataStatus([...masterDataSelected], 'enabled') }, `${t('enableSelected')}${masterDataSelected.size ? ` (${masterDataSelected.size})` : ''}`),
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: !masterDataSelected.size || masterDataLoading, onClick: () => void changeMasterDataStatus([...masterDataSelected], 'disabled') }, `${t('disableSelected')}${masterDataSelected.size ? ` (${masterDataSelected.size})` : ''}`),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--danger', disabled: !masterDataSelected.size || masterDataLoading, onClick: () => void deleteMasterRecords([...masterDataSelected]) }, `${t('delete')}${masterDataSelected.size ? ` (${masterDataSelected.size})` : ''}`)) : null,
        masterDataRows.length > 0 ? h(AIDataTable, {
          definition: masterDataDefinition, rows: masterDataRows, storageScope: 'hilda:dsh-procurement-intake',
          fillWidth: true,
          defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
          key: `master-data-${masterDataType}`,
          columnSettings: { storageKey: `hilda:dsh-procurement-intake:master-data:v2:${masterDataType}` },
          loading: masterDataLoading, onRefresh: refreshMasterData, getRowId: row => row.id,
          rowSelection: masterDataSelection,
          onRowSelectionChange: selection => setMasterDataSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
          leadingColumns: [masterDataSelectColumn], additionalColumns: [masterDataActionColumn], emptyText: emptyStateContent(t('noMasterData'), t('masterDataHelp'), { compact: true }),
        }) : masterDataLoading
          ? h('div', { className: 'pi-empty', role: 'status' }, h('div', { className: 'pi-empty-state-content' }, h('span', { className: 'pi-spinner', 'aria-hidden': true }), h('p', null, t('masterDataLoading'))))
          : h('div', { className: 'pi-empty' }, emptyStateContent(t('noMasterData'), t('masterDataHelp')))))
  const masterDataEditDrawer = masterDataDraft && h('div', {
    className: 'pi-drawer-overlay',
    onClick: event => { if (event.target === event.currentTarget && !masterDataSaving) setMasterDataDraft(null) },
  }, h('form', { className: 'pi-drawer-panel pi-detail-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('editMasterRecord'), onSubmit: event => { event.preventDefault(); void saveMasterRecord() } },
    h('div', { className: 'pi-detail-heading' },
      h('div', null, h('h3', { className: 'pi-dialog-title' }, t('editMasterRecord')), h('p', { className: 'pi-dialog-description' }, masterDataDraft.name || masterDataDraft.code || '')),
      h('div', { className: 'pi-order-detail-heading-actions' },
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: masterDataSaving, onClick: () => setMasterDataDraft(null) }, t('cancelEdit')),
        h('button', { type: 'submit', className: 'pi-button pi-button--small pi-button--primary', disabled: masterDataSaving || !masterDataDraft.name?.trim() }, masterDataSaving ? t('saving') : t('saveSettings')))),
    h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('masterDataFields')),
      h('div', { className: 'pi-detail-form' },
        masterDataType === 'materials' && h('label', { className: 'pi-detail-field' }, h('span', null, t('masterCode')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.code || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, code: event.target.value })) })),
        h('label', { className: 'pi-detail-field' }, h('span', null, t('masterName')), h('input', { className: 'pi-input pi-detail-input', autoFocus: true, value: masterDataDraft.name || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, name: event.target.value })) })),
        masterDataType === 'materials' && h(React.Fragment, null,
          h('label', { className: 'pi-detail-field' }, h('span', null, t('materialCategory')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.category || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, category: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('masterSpecification')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.specification || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, specification: event.target.value })) })),
          h('label', { className: 'pi-detail-field' }, h('span', null, t('masterUnit')), h('input', { className: 'pi-input pi-detail-input', value: masterDataDraft.unit || '', disabled: masterDataSaving, onChange: event => setMasterDataDraft(value => ({ ...value, unit: event.target.value })) })))))))
  const selectedOrderPreviewCount = orderPreview.filter(order => orderPreviewSelected.has(normalize(order.orderNo))).length
  const orderSection = h('section', { className: 'pi-card pi-order-page' },
    h('div', { className: 'pi-table-toolbar' }, h('h2', { className: 'pi-section-title' }, orderView === 'import' ? t('orderImportTab') : t('orderManageTab')),
      orderView === 'manage' ? h('span', { className: 'pi-table-total' }, t('orderTotalCount').replace('{count}', String(orderCount))) : null),
    orderView === 'import' ? h(React.Fragment, null,
      h('div', { className: 'pi-order-import-toolbar' }, h('p', { className: 'pi-help' }, t('orderImportHelp')),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary pi-order-import-button', disabled: parsing || importing, onClick: () => orderFileInputRef.current?.click() }, parsing ? t('parsing') : t('orderFiles'))),
      h('input', { ref: orderFileInputRef, className: 'pi-hidden-input', type: 'file', multiple: true, webkitdirectory: true, directory: true, accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', onChange: event => { void chooseOrderFiles(event.currentTarget.files); event.currentTarget.value = '' } }),
      orderFileErrors.length > 0 ? h('div', { className: 'pi-order-errors', role: 'status' }, h('strong', null, t('orderParseError')), h('ul', null, ...orderFileErrors.map((message, index) => h('li', { key: `${index}:${message}` }, message)))) : null,
      orderPreview.length > 0 ? h('section', { className: 'pi-order-preview' },
        orderSkippedRows > 0 ? h('p', { className: 'pi-help' }, `${t('skippedOrderRows').replace('{count}', String(orderSkippedRows))} ${t('skippedOrderRowsHelp')}`) : null,
        h('div', { className: 'pi-order-preview-toolbar' },
          h('div', { className: 'pi-order-preview-selection' },
            h('label', { className: 'pi-order-select-all' }, h('input', { className: 'pi-check', type: 'checkbox', checked: orderPreview.length > 0 && selectedOrderPreviewCount === orderPreview.length, disabled: importing, onChange: event => setOrderPreviewSelected(event.target.checked ? new Set(orderPreview.map(order => normalize(order.orderNo))) : new Set()), 'aria-label': t('selectAllQualified') }),
              h('span', null, t('selectAllQualified'))),
            h('span', { className: 'pi-order-selected-count' }, t('selectedQualifiedCount').replace('{selected}', String(selectedOrderPreviewCount)).replace('{total}', String(orderPreview.length)))),
          h('div', { className: 'pi-order-preview-actions' },
            h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: importing, onClick: () => void importOrders(true) }, importing ? t('orderImporting') : t('importAllOrders')),
            h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', disabled: importing || !selectedOrderPreviewCount, onClick: () => void importOrders(false) }, importing ? t('orderImporting') : t('importSelectedOrders')))),
        h('div', { className: 'pi-order-preview-list' }, ...orderPreview.map(order => {
          const key = normalize(order.orderNo)
          return h('div', { className: 'pi-order-preview-row', key: order.orderNo },
            h('input', { className: 'pi-check', type: 'checkbox', checked: orderPreviewSelected.has(key), disabled: importing, onChange: event => setOrderPreviewSelected(previous => { const next = new Set(previous); event.target.checked ? next.add(key) : next.delete(key); return next }), 'aria-label': `选择 ${order.orderNo}` }),
            h('strong', { title: `${order.orderNo} · ${t('requisitionNos')}: ${(order.requisitionNos || []).join('、') || '—'}` }, `${order.orderNo} · ${(order.requisitionNos || []).join('、') || '请购单号缺失'}`), h('span', { title: order.procurementOrg || order.buyer }, order.procurementOrg || order.buyer || '—'),
            h('span', { title: order.supplier }, order.supplier || '—'),
            h('span', null, `${order.items.length} ${t('itemCount')} · ${sumOrderItemValues(order, 'quantity')}`),
            h('span', { title: order.sourceFileName }, order.sourceFileName)
          )
        }))) : null)
      : h(React.Fragment, null,
        orderCount > 0 ? h('div', { className: 'pi-batch-bar' },
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: syncingPurchaseOrders || notifyingOrders, onClick: () => void syncPurchaseOrderNumbers() }, h(RefreshCw, { size: 15, strokeWidth: 2, 'aria-hidden': true }), syncingPurchaseOrders ? t('syncPurchaseOrdersLoading') : t('syncPurchaseOrders')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-order-batch-notify', disabled: !orderSelected.size || notifyingOrders || syncingPurchaseOrders, onClick: () => void notifySelectedOrders() }, h(Send, { size: 15, strokeWidth: 2, 'aria-hidden': true }), notifyingOrders ? t('saving') : t('notifyOrdersSelected')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--danger pi-order-batch-delete', disabled: !orderSelected.size || notifyingOrders || syncingPurchaseOrders, onClick: () => void deleteOrders([...orderSelected]) }, TRASH_ICON, orderSelected.size ? t('deleteOrdersSelected').replace('{count}', String(orderSelected.size)) : t('deleteSelected'))) : null,
        orderCount === 0 && !orderLoading ? h('div', { className: 'pi-empty' }, emptyStateContent('暂无采购订单', '请先导入订单 Excel。', {
          action: h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary pi-order-import-button', style: { marginTop: 12 }, onClick: () => setOrderView('import') }, t('startOrderImport')),
        })) : h(AIDataTable, {
          definition: orderDefinition, rows: orderRows, storageScope: 'hilda:dsh-procurement-intake',
          defaultMode: 'smart', modeLock: 'smart', showModeSwitch: false, showScopeNote: false,
          columnSettings: { storageKey: ORDER_COLUMN_SETTINGS_KEY, fieldOverrides: {
            buyer: { defaultVisible: false }, itemCount: { defaultVisible: false }, taxInclusiveTotal: { defaultVisible: false },
            taxExclusiveTotal: { defaultVisible: false }, taxRate: { defaultVisible: false }, recipient: { defaultVisible: false },
            recipientPhone: { defaultVisible: false }, deliveryTime: { defaultVisible: false }, paymentTerms: { defaultVisible: false },
            preparer: { defaultVisible: false }, requisitionType: { defaultVisible: false }, project: { defaultVisible: false },
            returnedQuantity: { defaultVisible: false }, stockInDate: { defaultVisible: false }, stockInQuantity: { defaultVisible: false },
            returnedStockQuantity: { defaultVisible: false }, replenishmentQuantity: { defaultVisible: false },
            unexecutedCloseQuantity: { defaultVisible: false }, requisitionLineClosed: { defaultVisible: false },
            sourceDocumentNo: { defaultVisible: false }, sourceDocumentLineNo: { defaultVisible: false }, lineRemark: { defaultVisible: false },
            requisitionQuantity: { defaultVisible: false }, orderedQuantity: { defaultVisible: false }, demandDate: { defaultVisible: false },
            suggestedOrderDate: { defaultVisible: false }, customer: { defaultVisible: false },
          } },
          loading: orderLoading, onRefresh: () => loadOrders(orderPage),
          page: orderPage, pageSize: orderPageSize,
          onPageChange: page => void loadOrders(page), onPageSizeChange: pageSize => { setOrderPageSize(pageSize); void loadOrders(1, pageSize) }, total: orderCount,
          onQueryChange: updateOrderTableQuery, queryFieldIds: ORDER_QUERY_FIELD_IDS,
          getRowId: row => row.id, rowSelection: orderSelection,
          onRowSelectionChange: selection => setOrderSelected(new Set(Object.keys(selection).filter(id => selection[id]))),
          leadingColumns: [orderSelectColumn], additionalColumns: [orderActionColumn], emptyText: emptyStateContent('没有匹配的采购订单', '请调整筛选条件后重试。', { compact: true }),
        })))
  const settingsSection = h('section', { className: 'pi-card' },
    h('div', { className: 'pi-inline' }, h('h2', { className: 'pi-section-title' }, t('modelSettings'))),
    h('p', { className: 'pi-help' }, '选择 AI 筛选 / 填色 / 字段生成使用的模型与推理强度。'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 } },
      h('span', { style: { minWidth: 90, color: 'var(--pc-color-text-secondary)', fontSize: 12 } }, t('modelLabel')),
      h(HildaSelect, { items: modelOptions.models.map(model => ({ value: model.id, label: model.name || model.id })), value: modelSettings.model, onValueChange: value => setModelSettings(prev => ({ ...prev, model: value })), 'aria-label': t('modelLabel') },
        h(HildaSelectTrigger, { className: 'pi-model-settings-select', style: { width: 240, minWidth: 0 } }, h(HildaSelectValue)),
        h(HildaSelectContent, { portalContainer: selectPortalRef.current },
          ...modelOptions.models.map(model => h(HildaSelectItem, { key: model.id, value: model.id }, model.name || model.id))))),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 } },
      h('span', { style: { minWidth: 90, color: 'var(--pc-color-text-secondary)', fontSize: 12 } }, t('reasoningEffortLabel')),
      h(HildaSelect, { items: modelOptions.reasoningEfforts.map(effort => ({ value: effort.id, label: effort.name || effort.id })), value: modelSettings.reasoningEffort, onValueChange: value => setModelSettings(prev => ({ ...prev, reasoningEffort: value })), 'aria-label': t('reasoningEffortLabel') },
        h(HildaSelectTrigger, { className: 'pi-reasoning-settings-select', style: { width: 150, minWidth: 0 } }, h(HildaSelectValue)),
        h(HildaSelectContent, { portalContainer: selectPortalRef.current },
          ...modelOptions.reasoningEfforts.map(effort => h(HildaSelectItem, { key: effort.id, value: effort.id }, effort.name || effort.id))))),
    h('button', { type: 'button', className: 'pi-button pi-button--primary', style: { marginTop: 14 }, onClick: saveModelSettings }, t('saveSettings')))

  const dashboardCounts = workspaceSummary?.counts || {}
  const dashboardTrend = workspaceSummary?.trend || []
  const dashboardHasTrend = dashboardTrend.some(item => item.requisitions || item.orders)
  const dashboardDate = value => {
    if (!value) return ''
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
  }
  function openWorkspaceRecord(item) {
    if (item.type === 'order') {
      setMenu('orders')
      setOrderView('manage')
      setOrderDetailRow(item.entity)
      setOrderDetailDraft(orderDraftFrom(item.entity))
      setEditingOrderDetails(false)
    } else {
      setMenu('requests')
      setRequestView('mine')
      openDetails(item.entity)
    }
  }
  function navigateWorkspaceMetric(target) {
    if (target === 'orders') {
      setMenu('orders')
      setOrderView('manage')
    } else {
      setMenu('requests')
      setRequestView(target === 'mine' || target === 'unmatched' ? 'mine' : 'intake')
    }
  }
  const dashboardMetrics = [
    { key: 'pending', label: t('metricPending'), value: dashboardCounts.pendingLines, icon: ClipboardList, target: 'pending' },
    { key: 'mine', label: t('metricMine'), value: dashboardCounts.ownedLines, icon: ListTodo, target: 'mine' },
    { key: 'orders', label: t('metricOrders'), value: dashboardCounts.purchaseOrders, icon: PackageCheck, target: 'orders' },
    { key: 'notice', label: t('metricWaitingNotice'), value: dashboardCounts.waitingVendorNotice, icon: Send, target: 'orders' },
    { key: 'unmatched', label: t('metricUnmatched'), value: dashboardCounts.unmatchedPurchaseOrders, icon: Unlink, target: 'unmatched' },
    { key: 'overdue', label: t('metricOverdue'), value: dashboardCounts.overdueDeliveries, icon: Truck, target: 'orders' },
  ]
  const chartConfig = {
    requisitions: { label: t('chartRequisitions'), color: 'var(--pc-color-primary)' },
    orders: { label: t('chartOrders'), color: 'var(--pc-color-info)' },
  }
  const dashboardChart = workspaceLoading && !workspaceSummary
    ? h('div', { className: 'pi-dashboard-empty', role: 'status' }, t('dashboardLoading'))
    : !dashboardHasTrend ? h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noTrend'), null, { compact: true }))
      : h(ChartContainer, { id: 'procurement-import-trend', className: 'pi-dashboard-chart', config: chartConfig },
        h(LineChart, { data: dashboardTrend, accessibilityLayer: true, margin: { left: 4, right: 8, top: 5, bottom: 0 } },
          h(CartesianGrid, { vertical: false, stroke: 'var(--pc-color-border-subtle)' }),
          h(XAxis, { dataKey: 'date', tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 24, tick: { fill: 'var(--pc-color-text-muted)', fontSize: 10 }, tickFormatter: value => String(value).slice(5) }),
          h(YAxis, { allowDecimals: false, width: 28, tickLine: false, axisLine: false, tick: { fill: 'var(--pc-color-text-muted)', fontSize: 10 } }),
          h(Tooltip, { content: h(ChartTooltipContent, { config: chartConfig, labelFormatter: value => dashboardDate(value) }) }),
          h(Legend, { verticalAlign: 'top', align: 'right', height: 22, iconType: 'circle', wrapperStyle: { fontSize: 10, color: 'var(--pc-color-text-secondary)' } }),
          h(Line, { type: 'monotone', dataKey: 'requisitions', name: t('chartRequisitions'), stroke: 'var(--color-requisitions)', strokeWidth: 2, dot: false, activeDot: { r: 4 } }),
          h(Line, { type: 'monotone', dataKey: 'orders', name: t('chartOrders'), stroke: 'var(--color-orders)', strokeWidth: 2, dot: false, activeDot: { r: 4 } })))
  const renderDashboardTodo = item => {
    const Icon = item.title === '预计到货已逾期' ? TriangleAlert : item.type === 'order' ? Send : ClipboardList
    return h('div', { className: `pi-dashboard-todo-row${item.isRead ? ' is-read' : ''}`, key: item.id },
      h('button', { type: 'button', className: 'pi-dashboard-todo-open', onClick: () => openWorkspaceRecord(item), 'aria-label': `${t('openRecord')}: ${item.title} · ${item.description}` },
        h('span', { className: 'pi-dashboard-row-icon' }, h(Icon, { 'aria-hidden': true })),
        h('span', { className: 'pi-dashboard-row-copy' }, h('strong', { className: 'pi-dashboard-row-title' }, item.title), h('small', { className: 'pi-dashboard-row-description' }, item.description)),
        item.dueDate && h('time', { className: 'pi-dashboard-row-time', dateTime: item.dueDate }, dashboardDate(item.dueDate))),
      h('button', { type: 'button', className: 'pi-dashboard-todo-read', disabled: workspaceTodoSaving.has(item.id), onClick: () => void setWorkspaceTodoRead(item.id, !item.isRead), 'aria-label': item.isRead ? t('markAsUnread') : t('markAsRead'), title: item.isRead ? t('markAsUnread') : t('markAsRead') },
        workspaceTodoSaving.has(item.id) ? h('span', { className: 'pi-spinner', 'aria-hidden': true }) : item.isRead ? h(Check, { 'aria-hidden': true }) : t('markAsRead')))
  }
  const dashboardTodos = workspaceSummary?.todos || []
  const dashboardTodoContent = workspaceLoading && !workspaceSummary
    ? h('div', { className: 'pi-dashboard-empty', role: 'status' }, t('dashboardLoading'))
    : dashboardTodos.length ? h('div', { className: 'pi-dashboard-list pi-dashboard-list--todo' }, ...dashboardTodos.slice(0, 5).map(renderDashboardTodo))
      : h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noTodos'), null, { compact: true }))
  const dashboardTodoDialog = workspaceTodoDialogOpen && h('div', { className: 'pi-dialog-overlay', onClick: event => { if (event.target === event.currentTarget) setWorkspaceTodoDialogOpen(false) } },
    h('section', { className: 'pi-dialog-panel pi-dashboard-todo-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('allTodos') },
      h('header', { className: 'pi-dashboard-todo-dialog-heading' },
        h('div', null, h('h3', null, t('allTodos')), h('p', null, t('todoCount').replace('{count}', String(dashboardTodos.length)))),
        h('button', { type: 'button', className: 'pi-button pi-button--small', onClick: () => setWorkspaceTodoDialogOpen(false) }, t('close'))),
      h('div', { className: 'pi-dashboard-todo-dialog-list' }, dashboardTodos.length
        ? h('div', { className: 'pi-dashboard-list pi-dashboard-list--todo' }, ...dashboardTodos.map(renderDashboardTodo))
        : h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noTodos'), null, { compact: true })))))
  const dashboardActivityContent = workspaceLoading && !workspaceSummary
    ? h('div', { className: 'pi-dashboard-empty', role: 'status' }, t('dashboardLoading'))
    : workspaceSummary?.recentActivity?.length ? h('div', { className: 'pi-dashboard-activity' }, ...workspaceSummary.recentActivity.map(item =>
      h('button', { type: 'button', className: 'pi-dashboard-row', key: item.id, onClick: () => openWorkspaceRecord(item), 'aria-label': `${item.title} · ${item.recordNo}` },
        h('span', { className: 'pi-dashboard-row-icon' }, h(Activity, { 'aria-hidden': true })),
        h('span', { className: 'pi-dashboard-row-copy' }, h('strong', { className: 'pi-dashboard-row-title' }, item.title), h('small', { className: 'pi-dashboard-row-description' }, `${item.recordNo || t(item.type === 'order' ? 'dashboardOrder' : 'dashboardRequest')}${item.detail ? ` · ${item.detail}` : ''}`)),
        h('time', { className: 'pi-dashboard-row-time', dateTime: item.createdAt }, dashboardDate(item.createdAt)))))
      : h('div', { className: 'pi-dashboard-empty' }, emptyStateContent(t('noActivity'), null, { compact: true }))
  const dashboardSection = h('section', { className: 'pi-dashboard', 'aria-label': t('dashboardTitle') },
    h('header', { className: 'pi-dashboard-heading' },
      h('div', null, h('h1', null, t('dashboardTitle')), h('p', null, t('dashboardSubtitle'))),
      h('button', { type: 'button', className: `pi-button pi-button--small pi-dashboard-refresh${workspaceLoading ? ' is-loading' : ''}`, disabled: workspaceLoading, onClick: () => void loadWorkspaceSummary(), 'aria-label': t('refreshDashboard') },
        h(RefreshCw, { 'aria-hidden': true }), h('span', null, workspaceLoading ? t('dashboardLoading') : t('refreshDashboard')))),
    workspaceError && h('p', { className: 'pi-error', role: 'alert' }, workspaceError),
    h('div', { className: 'pi-dashboard-metrics' }, ...dashboardMetrics.map(metric => {
      const Icon = metric.icon
      return h('button', { type: 'button', key: metric.key, className: 'pi-dashboard-metric is-actionable', onClick: () => navigateWorkspaceMetric(metric.target), 'aria-label': `${metric.label}: ${metric.value ?? 0}` },
        h('span', { className: 'pi-dashboard-metric-top' }, metric.label, h(Icon, { 'aria-hidden': true })),
        h('strong', null, workspaceLoading && !workspaceSummary ? '—' : Number(metric.value || 0).toLocaleString()))
    })),
    h('div', { className: 'pi-dashboard-main-grid' },
      h('section', { className: 'pi-dashboard-panel', 'aria-label': t('chartTitle') },
        h('div', { className: 'pi-dashboard-panel-heading' }, h('div', null, h('h2', null, t('chartTitle')), h('p', null, t('chartSubtitle')))), dashboardChart),
      h('section', { className: 'pi-dashboard-panel', 'aria-label': t('todoTitle') },
        h('div', { className: 'pi-dashboard-panel-heading' }, h('div', null, h('h2', null, t('todoTitle')), h('p', null, workspaceSummary ? t('todoCount').replace('{count}', String(dashboardTodos.length)) : '')),
          dashboardTodos.length > 5 && h('button', { type: 'button', className: 'pi-button pi-button--small pi-dashboard-todo-more', onClick: () => setWorkspaceTodoDialogOpen(true) }, t('viewAllTodos'))), dashboardTodoContent)),
    h('section', { className: 'pi-dashboard-panel', 'aria-label': t('activityTitle') },
      h('div', { className: 'pi-dashboard-panel-heading' }, h('div', null, h('h2', null, t('activityTitle')))), dashboardActivityContent))

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

  const orderTermGroups = orderDetailRow ? (() => {
    const clauses = Array.isArray(orderDetailRow.clauses) ? orderDetailRow.clauses : []
    const definitions = [
      { section: '付款', label: t('paymentTerms'), fallback: orderDetailRow.paymentTerms || [] },
      { section: '交付', label: t('deliveryTermsGroup'), fallback: [] },
      { section: '其他约定', label: t('otherTerms'), fallback: orderDetailRow.otherTerms || [] },
    ]
    return definitions.map(group => {
      const sourceItems = clauses.length ? clauses.filter(item => item.section === group.section).map(item => item.text) : group.fallback
      const seen = new Set()
      const items = sourceItems.filter(item => {
        if (!item) return false
        const key = String(item).trim()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return { ...group, items }
    }).filter(group => group.items.length)
  })() : []
  const orderDraftInput = (label, field, type = 'text', wide = false) => h('label', { className: `pi-detail-field${wide ? ' pi-detail-field--wide' : ''}`, key: field },
    h('span', null, label), h('input', {
      className: 'pi-input pi-detail-input', type, step: type === 'number' ? 'any' : undefined,
      value: orderDetailDraft?.[field] ?? '', disabled: savingOrderDetails,
      onChange: event => setOrderDetailDraft(current => ({ ...current, [field]: event.target.value })),
    }))
  const orderInformationContent = orderDetailRow && (editingOrderDetails
    ? h(React.Fragment, null,
      h('div', { className: 'pi-detail-form' },
        orderDraftInput(t('orderNo'), 'orderNo'),
        h('label', { className: 'pi-detail-field' }, h('span', null, t('purchaseOrderStatus')),
          h(HildaSelect, { items: [
            { value: '待通知供应商', label: t('pendingVendorNotice') },
            { value: '已通知供应商', label: t('vendorNotified') },
            { value: '取消了采购订单', label: t('purchaseOrderCancelled') },
          ], value: orderDetailDraft?.purchaseOrderStatus || '待通知供应商', onValueChange: value => setOrderDetailDraft(current => ({ ...current, purchaseOrderStatus: value })), 'aria-label': t('purchaseOrderStatus') },
          h(HildaSelectTrigger, { className: 'pi-detail-select' }, h(HildaSelectValue)),
          h(HildaSelectContent, { portalContainer: selectPortalRef.current },
            h(HildaSelectItem, { value: '待通知供应商' }, t('pendingVendorNotice')),
            h(HildaSelectItem, { value: '已通知供应商' }, t('vendorNotified')),
            h(HildaSelectItem, { value: '取消了采购订单' }, t('purchaseOrderCancelled'))))),
        orderDraftInput(t('orderDateLabel'), 'orderDate', 'date'),
        orderDraftInput(t('procurementOrg'), 'procurementOrg'),
        orderDraftInput(t('inventoryOrg'), 'inventoryOrg'),
        orderDraftInput(t('supplier'), 'supplier'),
        orderDraftInput(t('requisitionType'), 'requisitionType'),
        orderDraftInput(t('preparer'), 'preparer'),
        orderDraftInput(t('procurementOfficer'), 'procurementOfficer'),
        orderDraftInput(t('procurementDepartment'), 'procurementDepartment'),
        orderDraftInput(t('project'), 'project'),
        orderDraftInput(t('orderTotal'), 'taxInclusiveTotal', 'number'),
        orderDraftInput(t('taxExclusiveTotal'), 'taxExclusiveTotal', 'number'),
        orderDraftInput(t('taxRate'), 'taxRate'),
        orderDraftInput(t('deliveryAddressLabel'), 'deliveryAddress'),
        orderDraftInput(t('recipient'), 'recipient'),
        orderDraftInput(t('recipientPhone'), 'recipientPhone'),
        orderDraftInput(t('deliveryTime'), 'deliveryTime', 'date')),
      h('p', { className: 'pi-help' }, `${t('requisitionNos')}：${(orderDetailRow.requisitionNos || []).join('、') || uniqueOrderItemValues(orderDetailRow, 'requisitionNo') || '—'}。${t('requisitionNumbersReadOnly')}`))
    : h('div', { className: 'pi-detail-grid' },
      detailValue(t('orderNo'), copyCell(orderDetailRow.orderNo, t('orderNo'), true)), detailValue(t('purchaseOrderStatus'), orderDetailRow.purchaseOrderStatus || t('pendingVendorNotice')), detailValue(t('orderDateLabel'), orderDetailRow.orderDate),
      detailValue(t('requisitionNos'), copyCell((orderDetailRow.requisitionNos || []).join('、') || uniqueOrderItemValues(orderDetailRow, 'requisitionNo'), t('requisitionNos'), true)),
      detailValue(t('procurementOrg'), copyCell(orderDetailRow.procurementOrg || orderDetailRow.buyer, t('procurementOrg'), true)),
      detailValue(t('inventoryOrg'), orderDetailRow.inventoryOrg || uniqueOrderItemValues(orderDetailRow, 'inventoryOrg')),
      detailValue(t('supplier'), copyCell(orderDetailRow.supplier, t('supplier'), true)), detailValue(t('requisitionType'), orderDetailRow.requisitionType),
      detailValue(t('preparer'), orderDetailRow.preparer), detailValue(t('procurementOfficer'), orderDetailRow.procurementOfficer),
      detailValue(t('procurementDepartment'), orderDetailRow.procurementDepartment), detailValue(t('project'), orderDetailRow.project),
      detailValue(t('orderTotal'), orderDetailRow.taxInclusiveTotal == null ? '' : Number(orderDetailRow.taxInclusiveTotal).toLocaleString()),
      detailValue(t('taxExclusiveTotal'), orderDetailRow.taxExclusiveTotal == null ? '' : Number(orderDetailRow.taxExclusiveTotal).toLocaleString()),
      detailValue(t('taxRate'), orderDetailRow.taxRate), detailValue(t('deliveryAddressLabel'), orderDetailRow.deliveryAddress),
      detailValue(t('recipient'), orderDetailRow.recipient), detailValue(t('recipientPhone'), orderDetailRow.recipientPhone),
      detailValue(t('deliveryTime'), orderDetailRow.deliveryTime), detailValue(t('sourceFile'), orderDetailRow.sourceFileName),
      detailValue(t('importedAt'), formatDateTime(orderDetailRow.importedAt))))
  const orderDetailDialog = orderDetailRow && h('div', { className: 'pi-drawer-overlay', onClick: event => { if (event.target === event.currentTarget && !savingOrderDetails) { setOrderDetailRow(null); setEditingOrderDetails(false) } } },
    h('div', { className: 'pi-drawer-panel pi-detail-dialog pi-order-detail-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${t('orderDetails')} ${orderDetailRow.orderNo}` },
      h('div', { className: 'pi-detail-heading' }, h('div', null, h('h3', { className: 'pi-dialog-title' }, t('orderDetails')), h('p', { className: 'pi-dialog-description' }, orderDetailRow.orderNo)),
        h('div', { className: 'pi-order-detail-heading-actions' }, editingOrderDetails ? h(React.Fragment, null,
          h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingOrderDetails, onClick: () => { setOrderDetailDraft(orderDraftFrom(orderDetailRow)); setEditingOrderDetails(false) } }, t('discardChanges')),
          h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', disabled: savingOrderDetails, onClick: saveOrderDetails }, savingOrderDetails ? t('saving') : t('saveOrderInfo')))
          : h(React.Fragment, null,
            h('button', { type: 'button', className: 'pi-button pi-button--small', onClick: () => setEditingOrderDetails(true) }, t('editOrderInfo')),
            h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingOrderDetails, onClick: () => { setOrderDetailRow(null); setEditingOrderDetails(false) } }, t('close'))))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('orderInformation')),
        orderInformationContent),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, `${t('itemCount')} · ${orderDetailRow.items?.length || 0}`),
        h('div', { className: 'pi-order-detail-items-wrap' }, h('table', { className: 'pi-table pi-order-detail-items' },
          h('thead', null, h('tr', null, ...[t('orderItemSequence'), t('requisitionNos'), t('materialCode'), t('orderItems'), t('spec'), t('requisitionQuantity'), t('demandDate'), t('suggestedOrderDate'), t('orderedQuantity'), t('unitLabel'), t('expectedArrivalDate'), t('arrivalDate'), t('receivedQuantity'), t('returnedQuantity'), t('remainingQuantity'), t('stockInDate'), t('stockInQuantity'), t('returnedStockQuantity'), t('replenishmentQuantity'), t('unexecutedCloseQuantity'), t('customer'), t('materialCategory'), t('procurementOrg'), t('procurementOfficer'), t('procurementDepartment'), t('sourceDocumentNo'), t('sourceDocumentLineNo'), t('requisitionLineClosed'), t('lineRemark'), t('unitPrice'), t('lineAmount')].map(label => h('th', { key: label }, label)))),
          h('tbody', null, ...(orderDetailRow.items || []).map((item, index) => h('tr', { key: `${item.sequence || index}:${item.requisitionNo || item.name}` },
            h('td', null, item.sequence || index + 1), h('td', null, copyCell(item.requisitionNo, t('requisitionNo'))), h('td', null, copyCell(item.materialCode, t('materialCode'))),
            h('td', null, copyCell(item.name, t('material'))), h('td', null, item.specification || '—'),
            h('td', null, item.requisitionQuantity ?? '—'), h('td', null, item.demandDate || '—'), h('td', null, item.suggestedOrderDate || '—'),
            h('td', null, item.orderedQuantity ?? item.quantity ?? '—'), h('td', null, item.unit || '—'),
            h('td', null, item.expectedArrivalDate || '—'), h('td', null, item.arrivalDate || '—'),
            h('td', null, item.receivedQuantity ?? '—'), h('td', null, item.returnedQuantity ?? '—'), h('td', null, item.remainingQuantity ?? '—'),
            h('td', null, item.stockInDate || '—'), h('td', null, item.stockInQuantity ?? '—'), h('td', null, item.returnedStockQuantity ?? '—'),
            h('td', null, item.replenishmentQuantity ?? '—'), h('td', null, item.unexecutedCloseQuantity ?? '—'), h('td', null, item.customer || '—'), h('td', null, item.materialCategory || '—'),
            h('td', null, copyCell(item.procurementOrg, t('procurementOrg'))), h('td', null, item.procurementOfficer || '—'), h('td', null, item.procurementDepartment || '—'),
            h('td', null, item.sourceDocumentNo || '—'), h('td', null, item.sourceDocumentLineNo || '—'),
            h('td', null, item.requisitionLineClosed || '—'), h('td', null, item.lineRemark || '—'),
            h('td', null, item.taxInclusiveUnitPrice == null ? '—' : Number(item.taxInclusiveUnitPrice).toLocaleString()),
            h('td', null, item.amount == null ? '—' : Number(item.amount).toLocaleString()))))))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('orderTerms')),
        orderTermGroups.length ? h('div', { className: 'pi-order-detail-terms' }, ...orderTermGroups.map(group => h('section', { className: 'pi-order-detail-term-group', key: group.section },
          h('h5', null, group.label), h('ol', null, ...group.items.map((item, index) => h('li', { key: `${group.section}:${index}` }, item)))))) : h('p', { className: 'pi-help' }, t('notRecorded'))),
      h('section', { className: 'pi-detail-section' }, h('h4', { className: 'pi-detail-section-title' }, t('activityHistory')),
        orderDetailRow.activityLog?.length ? h('div', { className: 'pi-detail-history' }, ...[...orderDetailRow.activityLog].slice(-8).reverse().map(item => h('article', { className: 'pi-detail-history-item', key: item.id }, h('strong', null, item.action), h('span', null, formatDateTime(item.createdAt)), h('p', null, item.detail)))) : h('p', { className: 'pi-help' }, t('noOperationHistory'))),
      h('div', { className: 'pi-dialog-actions' }, h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingOrderDetails, onClick: () => { setOrderDetailRow(null); setEditingOrderDetails(false) } }, t('close')))))
  const supplierDialog = supplierDialogOpen && h('div', { className: 'pi-dialog-overlay', onClick: event => { if (event.target === event.currentTarget && !savingBatchSupplier) setSupplierDialogOpen(false) } },
    h('div', { className: 'pi-dialog-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('batchSupplier') },
      h('h3', { className: 'pi-dialog-title' }, t('batchSupplier')),
      h('p', { className: 'pi-dialog-description' }, t('batchSupplierConfirm').replace('{count}', String(mineSelected.size))),
      h('label', { className: 'pi-detail-field', style: { marginTop: 16 } }, h('span', null, t('supplier')),
        h('input', { className: 'pi-input', type: 'text', value: batchSupplierDraft, autoFocus: true, placeholder: t('supplierPlaceholder'), onChange: event => setBatchSupplierDraft(event.target.value) })),
      h('div', { className: 'pi-dialog-actions' },
        h('button', { type: 'button', className: 'pi-button pi-button--small', disabled: savingBatchSupplier, onClick: () => setSupplierDialogOpen(false) }, t('close')),
        h('button', { type: 'button', className: 'pi-button pi-button--small pi-button--primary', style: { width: 'auto' }, disabled: !batchSupplierDraft.trim() || savingBatchSupplier, onClick: applySupplierToSelected }, savingBatchSupplier ? t('saving') : t('batchSupplier')))));

  return h('main', { ref: selectPortalRef, className: 'pc-intake' }, h('style', null, css + hildaUiCSS + aiTableCSS + copyCellCSS + masterDataCSS + hoverTooltipCSS + workspaceCSS + tableStickyCSS + interactionFixCSS + '.pi-batch-bar .cn-button.pi-button--small{min-height:28px;padding:3px 10px;font-size:12px}.pc-intake .pi-spinner{width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:pi-intake-spin .75s linear infinite;flex:none}@keyframes pi-intake-spin{to{transform:rotate(360deg)}}.pi-order-import-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px}.pi-order-import-toolbar .pi-help{margin:0}.pi-order-import-button{width:auto;white-space:nowrap}.pi-order-batch-delete{width:auto;flex:0 0 auto;white-space:nowrap}.pi-order-action-button{white-space:nowrap}.pi-drawer-overlay{position:fixed;inset:0;z-index:80;display:flex;justify-content:flex-end;background:rgb(17 25 45 / 22%);padding:0}.pi-drawer-panel{width:min(760px,calc(100vw - 16px));max-width:min(760px,calc(100vw - 16px));height:100vh;max-height:100vh;margin:0;padding:20px 24px;overflow-y:auto;overscroll-behavior:contain;background:var(--pc-color-surface);border:1px solid var(--pc-color-border);border-right:0;border-radius:var(--pc-radius-lg) 0 0 var(--pc-radius-lg);box-shadow:var(--pc-shadow-menu)}.pi-drawer-panel.pi-order-detail-dialog{width:min(900px,calc(100vw - 16px));max-width:900px}.pi-drawer-panel .pi-detail-heading{position:sticky;top:-20px;z-index:2;margin:-20px -24px 0;padding:18px 24px 14px;background:var(--pc-color-surface);border-bottom:1px solid var(--pc-color-border)}.pi-order-detail-items-wrap{max-height:330px;overflow:auto;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-md)}.pi-order-detail-items{min-width:2400px;margin:0}.pi-order-detail-items th,.pi-order-detail-items td{padding:8px 10px!important}.pi-order-detail-items td{font-size:11px}.pi-order-detail-terms{display:grid;gap:10px}.pi-order-detail-term-group{padding:12px 14px;border-radius:var(--pc-radius-md);background:var(--pc-color-surface-raised)}.pi-order-detail-term-group h5{margin:0 0 8px;color:var(--pc-color-text);font-size:12px;font-weight:650}.pi-order-detail-term-group ol{display:flex;flex-direction:column;gap:7px;margin:0;padding-left:20px;color:var(--pc-color-text-secondary);font-size:12px}.pi-order-detail-term-group li{padding-left:3px;white-space:pre-wrap;overflow-wrap:anywhere}.pi-order-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px}.pi-order-toolbar .pi-help{margin:4px 0 0}.pi-order-preview,.pi-order-errors{margin-top:12px;padding:10px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface-raised)}.pi-order-preview-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px}.pi-order-preview-selection{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.pi-order-select-all{display:inline-flex;align-items:center;gap:6px;color:var(--pc-color-text-secondary);font-size:11px;cursor:pointer}.pi-order-select-all .pi-check,.pi-order-preview-row .pi-check{margin:0}.pi-order-selected-count{color:var(--pc-color-text-muted);font-size:11px;white-space:nowrap}.pi-order-preview-actions{display:flex;align-items:center;gap:8px}.pi-order-preview-actions .pi-button{width:auto;white-space:nowrap}.pi-order-preview-list{display:flex;flex-direction:column;gap:6px;margin-top:8px}.pi-order-preview-row{display:grid;grid-template-columns:18px 1.1fr 1fr .7fr .7fr 1.6fr;gap:10px;align-items:center;padding:7px 8px;border-radius:var(--pc-radius-md);background:var(--pc-color-surface);font-size:11px}.pi-order-preview-row strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pi-order-preview-row span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pc-color-text-secondary)}.pi-order-errors{color:var(--pc-color-danger-text);font-size:11px}.pi-order-errors ul{margin:6px 0 0;padding-left:18px}.pi-order-list-heading{margin-top:18px}.pi-order-table{min-width:950px}.pi-order-table tbody tr.pi-order-row{cursor:pointer}.pi-order-expand{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:5px;border:0;border-radius:5px;background:transparent;color:var(--pc-color-text-secondary);font-size:18px;vertical-align:middle;cursor:pointer}.pi-order-expand:hover{background:var(--pc-color-neutral-bg)}.pi-order-detail-row td{background:var(--pc-color-surface-raised)!important}.pi-order-items-wrap{max-height:260px;margin-top:12px}.pi-order-items{min-width:820px}.pi-order-terms{margin-top:10px;color:var(--pc-color-text-secondary);font-size:11px}.pi-order-terms p{margin:5px 0}.pi-order-pagination{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:12px;color:var(--pc-color-text-secondary);font-size:11px}@media(max-width:600px){.pi-order-toolbar{align-items:flex-start;flex-direction:column}.pi-order-import-toolbar{align-items:flex-start;flex-direction:column}.pi-order-preview-toolbar{align-items:flex-start;flex-direction:column}.pi-order-preview-row{grid-template-columns:18px 1fr 1fr}.pi-drawer-panel,.pi-drawer-panel.pi-order-detail-dialog{width:100vw;max-width:100vw;padding:16px;border-radius:0}.pi-drawer-panel .pi-detail-heading{top:-16px;margin:-16px -16px 0;padding:16px}.pi-order-pagination{justify-content:space-between}}'), h('div', { className: 'pi-stack' },
    h('nav', { className: 'pi-menu', 'aria-label': t('category') }, ...[
      ['workspace', t('workspace'), LayoutDashboard], ['requests', t('requests'), ClipboardList],
      ['orders', t('ordersMenu'), PackageCheck], ['issues', t('issues'), TriangleAlert],
      ['settings', t('modelSettings'), Settings2], ['masterData', t('masterData'), Database],
    ].map(([key, label, Icon]) => h('button', { key, type: 'button', className: 'pi-menu-item', onClick: () => { if (key === 'masterData') { setMasterDataType(null); setMasterDataRows([]); setMasterDataDraft(null); setMasterDataSelected(new Set()); setMasterDataOverviewCount(null) } setMenu(key) }, 'aria-current': menu === key ? 'page' : undefined }, h(Icon, { 'aria-hidden': true }), h('span', null, label)))),
    success && h('div', { className: 'cn-toast', role: 'status', 'aria-live': 'polite' },
      h('span', { className: 'cn-toast-mark', 'aria-hidden': true }, '✓'),
      h('div', { className: 'cn-toast-copy' }, h('strong', null, success)),
      h('button', { type: 'button', className: 'cn-button cn-button-variant-ghost cn-button-size-icon', 'aria-label': t('close'), onClick: () => setSuccess('') }, '×')),
    error && h('p', { className: 'pi-error', role: 'alert' }, error),
    menu === 'requests' && h('nav', { className: 'pi-tabs', 'aria-label': t('requests') }, ...[['intake', `${t('pendingTab')} · ${store.pendingTotal}`], ['mine', `${t('mineTab')} · ${store.mineTotal}`]].map(([key, label]) => h('button', { key, type: 'button', className: 'pi-tab', onClick: () => setRequestView(key), 'aria-pressed': requestView === key }, label))),
    menu === 'orders' && h('nav', { className: 'pi-tabs', 'aria-label': t('ordersMenu') }, ...[['import', t('orderImportTab')], ['manage', `${t('orderManageTab')} · ${orderCount}`]].map(([key, label]) => h('button', { key, type: 'button', className: 'pi-tab', onClick: () => setOrderView(key), 'aria-pressed': orderView === key }, label))),
    ...(menu === 'requests'
      ? (requestView === 'intake' ? [uploadSection, previewSection, searchSection, batchSection, candidateSection] : [mineSection])
      : menu === 'orders' ? [orderSection] : menu === 'settings' ? [settingsSection] : menu === 'masterData' ? [masterDataSection] : menu === 'workspace' ? [dashboardSection] : [placeholder]),
    h('p', { className: 'pi-footer' }, t('localStorageNote'))), shipDialog, detailDialog, orderDetailDialog, supplierDialog, masterDataEditDrawer, dashboardTodoDialog)
}

function createAiAdapter(data, sessionId) {
  const metadata = (fields) => fields.map(({ fieldId, label, type, options }) => ({ fieldId, label, type, options: options ?? [] }))
  return {
    async generateFilters({ instruction, fields }) {
      const allowed = fields.filter((field) => field.aiReadable && field.filterable)
      return data.aiGenerate('filters', { instruction, fields: metadata(allowed) }, sessionId)
    },
    async generateColorRules({ instruction, fields }) {
      const allowed = fields.filter((field) => field.aiReadable && field.colorable)
      return data.aiGenerate('colors', { instruction, fields: metadata(allowed) }, sessionId)
    },
    async previewAIField({ definition, rows, rowKey, fields }) {
      const allowed = definition.referencedFieldIds.map((id) => {
        const field = fields.find((item) => item.fieldId === id && item.aiReadable)
        if (!field) throw new Error(`AI reference must be readable: ${id}`)
        return field
      })
      return data.aiGenerate('field-preview', {
        definition,
        fields: metadata(allowed),
        rows: rows.map((row) => ({ rowKey: rowKey(row), values: Object.fromEntries(allowed.map((field) => [field.fieldId, field.getValue(row)])) })),
      }, sessionId)
    },
  }
}

function dataAccess(ctx) {
  const proc = () => ctx.get('remote.procurement')
  const unwrap = async (promise) => {
    const result = await promise
    if (!result.ok) {
      const error = result.error
      const message = error instanceof Error ? error.message : (typeof error === 'string' ? error : (error && error.message) ? error.message : String(error))
      console.error('[procurement] remote error:', error)
      throw new Error(message || '操作失败')
    }
    return result.value
  }
  return {
    list: (status, page, pageSize, sort, filters, keywords) => unwrap(proc().list({ status, page, pageSize, sort, filters, keywords })),
    listPurchaseOrders: (page, pageSize, sort, filters) => unwrap(proc().listPurchaseOrders({ page, pageSize, sort, filters })),
    workspaceSummary: (days) => unwrap(proc().workspaceSummary({ days })),
    setWorkspaceTodosRead: (ids, isRead) => unwrap(proc().setWorkspaceTodosRead({ ids, isRead })),
    updatePurchaseOrder: (id, updates) => unwrap(proc().updatePurchaseOrder({ id, ...updates })),
    importPurchaseOrders: (orders) => unwrap(proc().importPurchaseOrders({ orders })),
    deletePurchaseOrders: (ids) => unwrap(proc().deletePurchaseOrders({ ids })),
    cancelPurchaseOrders: (ids) => unwrap(proc().cancelPurchaseOrders({ ids })),
    notifyPurchaseOrders: (ids) => unwrap(proc().notifyPurchaseOrders({ ids })),
    syncOwnedPurchaseOrderNumbers: () => unwrap(proc().syncOwnedPurchaseOrderNumbers({})),
    claim: (ids) => unwrap(proc().claim({ ids })),
    importLines: (lines, fileName, sheetName) => unwrap(proc().importLines({ lines, fileName, sheetName })),
    clearPending: () => unwrap(proc().clearPending({})),
    deleteOwned: (ids) => unwrap(proc().deleteOwned({ ids })),
    updateLine: (id, updates) => unwrap(proc().updateLine({ id, ...updates })),
    updateSuppliers: (ids, supplier) => unwrap(proc().updateSuppliers({ ids, supplier })),
    aiGenerate: (operation, payload, sessionId) => unwrap(proc().aiGenerate({ operation, payload, sessionId })),
    listModelOptions: () => unwrap(proc().listModelOptions({})),
    getModelSettings: () => unwrap(proc().getModelSettings({})),
    updateModelSettings: (model, reasoningEffort) => unwrap(proc().updateModelSettings({ model, reasoningEffort })),
    listMasterData: type => unwrap(proc().listMasterData({ type })),
    saveMasterData: (type, value) => unwrap(proc().saveMasterData({ type, ...value })),
    setMasterDataStatus: (type, ids, status) => unwrap(proc().setMasterDataStatus({ type, ids, status })),
    deleteMasterData: (type, ids) => unwrap(proc().deleteMasterData({ type, ids })),
  }
}

module.exports = {
  inject: ['slots', 'sidebarRightTabs', 'locale', 'remote'],
  async apply(ctx) {
    const t = ctx.locale.bind(namespace)
    ctx.effect(() => ctx.locale.register(namespace, { zh, en }), 'procurement-intake: dictionaries')
    const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)
    ctx.effect(() => disposeRemote, 'procurement-intake: remote')
    ctx.effect(() => ctx.sidebarRightTabs.register({ id: '@hilda-biz/dsh-procurement-intake', kind: 'procurement-intake', priority: 'extension', title: () => t('title'), guide: [{ id: 'intake', order: 30, title: () => t('title'), description: () => t('subtitle'), icon: PluginGuideIcon }] }), 'procurement-intake: tab type')
    const data = dataAccess(ctx)
    ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({ name: 'sidebar.right.pane.tab', key: '@hilda-biz/dsh-procurement-intake', locale: namespace }, (props) => h(IntakeErrorBoundary, null, h(IntakeBody, { ...props, data })))), 'procurement-intake: tab body')
  },
}
