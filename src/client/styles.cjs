const aiTableCSS = __AI_TABLE_CSS__
const hildaUiCSS = __HILDA_UI_CSS__ + '.pi-badge--danger{background:var(--pc-color-danger-bg);color:var(--pc-color-danger-text)}.pi-order-menu-trigger{display:inline-grid;place-items:center;width:32px;height:32px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-md);background:var(--pc-color-surface,#fff);color:var(--pc-color-text-secondary,#536176);font-size:20px;line-height:1;cursor:pointer}.pi-order-menu-trigger:hover{background:var(--pc-color-neutral-bg,#f1f4f8);color:var(--pc-color-text,#172033)}.pi-order-action-menu{z-index:100;min-width:148px;padding:4px;border:1px solid var(--pc-color-border,#d9dee7);border-radius:var(--pc-radius-md,8px);background:var(--pc-color-surface,#fff);box-shadow:var(--pc-shadow-menu,0 8px 24px rgba(17,25,45,.16));color:var(--pc-color-text,#172033)}.pi-order-action-menu-item{display:flex;align-items:center;min-height:32px;padding:0 9px;border-radius:var(--pc-radius-sm,4px);font-size:12px;outline:none;cursor:pointer}.pi-order-action-menu-item[data-highlighted]{background:var(--pc-color-neutral-bg,#f1f4f8)}.pi-order-action-menu-item--danger{color:var(--pc-color-danger-text,#b42318)}.pi-order-action-menu-item[data-disabled]{opacity:.45;pointer-events:none}.pi-order-batch-notify{background:var(--pc-color-success,#34c759);border-color:var(--pc-color-success,#34c759);color:var(--pc-color-primary-foreground,#fff)}.pi-order-batch-notify:hover:not(:disabled){filter:brightness(.93)}.pi-button.pi-order-batch-notify:hover:not(:disabled){background:var(--pc-color-success,#34c759);border-color:var(--pc-color-success,#34c759);color:var(--pc-color-primary-foreground,#fff);filter:brightness(.93)}.pi-order-detail-heading-actions{display:flex;align-items:center;gap:6px;flex:0 0 auto;flex-wrap:nowrap;justify-content:flex-end;min-width:0}.pi-order-detail-heading-actions .pi-button{flex:none;white-space:nowrap}.pi-drawer-panel.pi-order-detail-dialog .pi-detail-heading{box-sizing:border-box;width:calc(100% + 48px);margin-left:-24px;margin-right:-24px;padding-left:24px;padding-right:24px;align-items:center}.pi-order-detail-dialog .pi-detail-heading>div:first-child{flex:1 1 0;min-width:0}.pi-order-detail-dialog .pi-detail-copy-cell{color:var(--pc-color-text)}'
const copyCellCSS = '.pi-copy-cell{display:flex;align-items:center;gap:6px;width:100%;min-width:0;padding:0;border:0;background:transparent;color:color-mix(in srgb,var(--pc-color-info) 34%,var(--pc-color-text-secondary));font:inherit;text-align:left;cursor:pointer}.pi-copy-cell:hover{color:color-mix(in srgb,var(--pc-color-info) 52%,var(--pc-color-text-secondary))}.pi-copy-cell:hover .pi-copy-cell-text{text-decoration:underline;text-underline-offset:2px}.pi-copy-cell:focus-visible{border-radius:3px;outline:2px solid var(--pc-color-focus);outline-offset:2px}.pi-copy-cell-icon{flex:0 0 14px;opacity:.8}.pi-copy-cell-text{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pi-detail-copy-cell{width:auto;max-width:100%;font-size:12px;font-weight:550}.pi-order-detail-items .pi-copy-cell{max-width:100%}'
const masterDataCSS = '.pi-master-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:14px}.pi-master-tile{display:flex;min-height:112px;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;padding:16px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface-raised);color:var(--pc-color-text);text-align:left;cursor:pointer;transition:background-color 120ms ease-out,border-color 120ms ease-out,box-shadow 120ms ease-out}.pi-master-tile:hover{background:var(--pc-color-surface);border-color:var(--pc-color-border-strong);box-shadow:var(--pc-shadow-menu)}.pi-master-tile strong{font-size:14px;font-weight:650}.pi-master-tile>span:last-child{color:var(--pc-color-text-muted);font-size:11px}.pi-master-tile-icon{display:grid;place-items:center;width:32px;height:32px;border:1px solid var(--pc-color-border);border-radius:8px;color:var(--pc-color-text-secondary)}.pi-master-tile-icon svg{width:17px;height:17px;stroke-width:1.8}.pi-master-subnav{display:flex;align-items:center;gap:6px;margin:12px 0;padding:3px;border:1px solid var(--pc-color-border);border-radius:9px;background:var(--pc-color-surface-raised)}.pi-master-subnav-item,.pi-master-back{min-height:30px;padding:5px 11px;border:0;border-radius:6px;background:transparent;color:var(--pc-color-text-secondary);font:inherit;font-size:12px;cursor:pointer}.pi-master-subnav-item.is-active{background:var(--pc-color-surface);color:var(--pc-color-text);font-weight:600;box-shadow:0 1px 3px rgb(17 25 45 / 10%)}.pi-master-back{font-size:18px;line-height:1}.pi-master-form{display:flex;flex-direction:column;gap:12px;margin:12px 0;padding:14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-md);background:var(--pc-color-surface-raised)}.pi-master-form-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.pi-master-form-actions{display:flex;justify-content:flex-end;gap:8px}.pi-master-form .pi-detail-field{min-width:0}.pi-master-form .pi-input{width:100%}'
const hoverTooltipCSS = '.ai-table-plugin td[data-tooltip]:not(.sticky){position:relative}.ai-table-plugin td[data-tooltip].is-truncated-tooltip:hover{overflow:visible!important;z-index:70}.ai-table-plugin td[data-tooltip]::after{position:absolute;top:calc(100% + 4px);left:8px;z-index:1000;max-width:min(420px,70vw);width:max-content;padding:6px 8px;border:1px solid rgba(255,255,255,.12);border-radius:6px;background:#171717;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.22);font:12px/1.45 var(--pc-font-sans);white-space:normal;overflow-wrap:anywhere;pointer-events:none;content:attr(data-tooltip);opacity:0}.ai-table-plugin td[data-tooltip].is-truncated-tooltip:hover::after{animation:pi-ai-tooltip-in .1s ease-out .12s forwards}@keyframes pi-ai-tooltip-in{to{opacity:1}}'
const tableStickyCSS = '.pc-intake .pi-card:has(> .ai-table-plugin){box-sizing:border-box;position:sticky;top:8px;z-index:20;display:flex;flex-direction:column;height:auto;max-height:calc(100vh - 64px);overflow:hidden;background:var(--pc-color-surface)}.pc-intake .pi-card:has(> .ai-table-plugin)>.pi-table-toolbar,.pc-intake .pi-card:has(> .ai-table-plugin)>.pi-batch-bar{flex:none}.pc-intake .pi-card:has(> .ai-table-plugin)>.ai-table-plugin{display:flex;flex:1;flex-direction:column;min-height:0;overflow:hidden}.pc-intake .ai-table-plugin>.flex.w-full.flex-col{display:flex;flex:1;flex-direction:column;min-height:0;overflow:hidden}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t{display:flex;flex:1;flex-direction:column;min-height:0;overflow:auto}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t>.overflow-x-auto,.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t .relative.w-full.overflow-x-auto{flex:1;min-height:0;overflow:visible!important}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t+div{flex:0 0 auto;background:var(--pc-color-surface)}.pc-intake .ai-table-plugin thead{position:sticky;top:0;z-index:20}.pc-intake .ai-table-plugin thead th{background:var(--pc-color-table-header);background-clip:padding-box}.pi-dashboard-panel-heading-actions{display:flex;align-items:center;gap:8px}.pi-dashboard-todo-more{white-space:nowrap}.pi-dashboard-list--todo{gap:0}.pi-dashboard-todo-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--pc-color-border-subtle)}.pi-dashboard-todo-row:last-child{border-bottom:0}.pi-dashboard-todo-open{display:flex;flex:1;align-items:flex-start;gap:9px;min-width:0;padding:0;border:0;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}.pi-dashboard-todo-open:hover .pi-dashboard-row-title{color:var(--pc-color-primary-hover)}.pi-dashboard-todo-row.is-read .pi-dashboard-row-title{color:var(--pc-color-text-muted);font-weight:500}.pi-dashboard-todo-row.is-read .pi-dashboard-row-icon{opacity:.65}.pi-dashboard-todo-read{display:inline-flex;flex:none;align-items:center;gap:4px;padding:4px 6px;border:0;border-radius:6px;background:transparent;color:var(--pc-color-text-muted);font:inherit;font-size:10px;cursor:pointer}.pi-dashboard-todo-read:hover{background:var(--pc-color-neutral-bg);color:var(--pc-color-text-secondary)}.pi-dashboard-todo-read svg{width:13px;height:13px}.pi-dashboard-todo-dialog{display:flex;flex-direction:column;max-width:min(620px,calc(100vw - 32px));max-height:calc(100vh - 32px);padding:0;overflow:hidden}.pi-dashboard-todo-dialog-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid var(--pc-color-border)}.pi-dashboard-todo-dialog-heading h3{margin:0;color:var(--pc-color-text);font-size:15px;font-weight:650}.pi-dashboard-todo-dialog-heading p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-dashboard-todo-dialog-list{min-height:0;overflow-y:auto;padding:8px 18px 14px}.pi-dashboard-todo-dialog-list .pi-dashboard-todo-row{padding:10px 0}.pi-dashboard-todo-dialog-list .pi-dashboard-row-title{font-size:12px}.pi-dashboard-todo-dialog-list .pi-dashboard-row-description{font-size:11px}'
const interactionFixCSS = '.pi-cell-tooltip{position:fixed;z-index:9999;max-width:min(420px,70vw);width:max-content;padding:6px 8px;border:1px solid rgb(255 255 255 / 12%);border-radius:6px;background:#171717;color:#fff;box-shadow:0 4px 14px rgb(0 0 0 / 22%);font:12px/1.45 var(--pc-font-sans);white-space:normal;overflow-wrap:anywhere;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 80ms ease-out}.pi-cell-tooltip.is-visible{opacity:1;visibility:visible}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t{overflow:hidden!important}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t>.overflow-x-auto{flex:1;min-height:0;overflow:auto!important;overscroll-behavior:contain}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t+div{flex:0 0 auto;position:sticky;bottom:0;z-index:31;background:var(--pc-color-surface)}.pc-intake .ai-table-plugin>.flex.w-full.flex-col>.relative.border-t>.overflow-x-auto>[data-slot=table-container]{width:max-content;min-width:100%;overflow:visible!important}.pc-intake .ai-table-plugin thead{position:sticky;top:0;z-index:30}.pc-intake .ai-table-plugin thead th{background:var(--pc-color-table-header);background-clip:padding-box}'
const workspaceCSS = '.pi-dashboard{display:flex;flex-direction:column;gap:12px}.pi-dashboard-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.pi-dashboard-heading h1{margin:0;font-size:17px;font-weight:650}.pi-dashboard-heading p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:11px}.pi-dashboard-refresh{display:inline-flex;align-items:center;gap:6px;flex:none}.pi-dashboard-refresh svg{width:14px;height:14px}.pi-dashboard-refresh.is-loading svg{animation:pi-intake-spin .75s linear infinite}.pi-dashboard-metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.pi-dashboard-metric{min-width:0;padding:13px 14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface)}.pi-dashboard-metric-top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--pc-color-text-secondary);font-size:11px}.pi-dashboard-metric-top svg{width:16px;height:16px;flex:none;color:var(--pc-color-text-muted)}.pi-dashboard-metric strong{display:block;margin-top:8px;color:var(--pc-color-text);font-size:24px;line-height:1.15;font-weight:650;font-variant-numeric:tabular-nums}.pi-dashboard-metric.is-actionable{cursor:pointer;transition:border-color 120ms ease-out,background-color 120ms ease-out}.pi-dashboard-metric.is-actionable:hover{border-color:var(--pc-color-border-strong);background:var(--pc-color-surface-hover)}.pi-dashboard-main-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,1fr);gap:12px;align-items:stretch}.pi-dashboard-panel{min-width:0;padding:14px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface)}.pi-dashboard-panel-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}.pi-dashboard-panel-heading h2{margin:0;font-size:13px;font-weight:650}.pi-dashboard-panel-heading p{margin:4px 0 0;color:var(--pc-color-text-muted);font-size:10px}.pi-dashboard-chart{height:236px;min-height:236px;width:100%}.pi-chart-tooltip{min-width:132px;padding:8px 10px;border:1px solid var(--pc-color-border);border-radius:8px;background:var(--pc-color-surface);box-shadow:var(--pc-shadow-menu);color:var(--pc-color-text);font-size:11px}.pi-chart-tooltip-title{margin-bottom:5px;color:var(--pc-color-text-muted);font-size:10px}.pi-chart-tooltip-row{display:flex;align-items:center;gap:6px}.pi-chart-tooltip-row+ .pi-chart-tooltip-row{margin-top:4px}.pi-chart-tooltip-dot{width:8px;height:8px;border-radius:50%;flex:none}.pi-chart-tooltip-row strong{margin-left:auto;font-variant-numeric:tabular-nums}.pi-dashboard-list{display:flex;flex-direction:column;gap:2px}.pi-dashboard-row{display:flex;align-items:flex-start;gap:9px;width:100%;min-width:0;padding:9px 2px;border:0;border-bottom:1px solid var(--pc-color-border-subtle);background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}.pi-dashboard-row:last-child{border-bottom:0}.pi-dashboard-row:hover .pi-dashboard-row-title{color:var(--pc-color-primary-hover)}.pi-dashboard-row-icon{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:7px;background:var(--pc-color-neutral-bg);color:var(--pc-color-text-secondary)}.pi-dashboard-row-icon svg{width:14px;height:14px}.pi-dashboard-row-copy{flex:1;min-width:0}.pi-dashboard-row-title{display:block;overflow:hidden;color:var(--pc-color-text);font-size:11px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.pi-dashboard-row-description{display:block;margin-top:3px;overflow:hidden;color:var(--pc-color-text-muted);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.pi-dashboard-row-time{flex:none;color:var(--pc-color-text-muted);font-size:10px;white-space:nowrap}.pi-dashboard-empty{display:grid;min-height:120px;place-items:center;padding:18px;color:var(--pc-color-text-muted);font-size:11px;text-align:center}.pi-dashboard-activity{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}.pi-dashboard-activity .pi-dashboard-row{padding:8px 2px}@media(max-width:1000px){.pi-dashboard-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:600px){.pi-dashboard-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.pi-dashboard-main-grid{grid-template-columns:1fr}.pi-dashboard-activity{grid-template-columns:1fr}}@media(max-width:480px){.pi-dashboard-heading{align-items:flex-start}.pi-dashboard-refresh span{display:none}.pi-dashboard-metric{padding:11px}.pi-dashboard-metric strong{font-size:21px}}'

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

const orderLayoutCSS = String.raw`.pi-batch-bar .cn-button.pi-button--small{min-height:28px;padding:3px 10px;font-size:12px}.pc-intake .pi-spinner{width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:pi-intake-spin .75s linear infinite;flex:none}@keyframes pi-intake-spin{to{transform:rotate(360deg)}}.pi-order-import-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px}.pi-order-import-toolbar .pi-help{margin:0}.pi-order-import-button{width:auto;white-space:nowrap}.pi-order-batch-delete{width:auto;flex:0 0 auto;white-space:nowrap}.pi-order-action-button{white-space:nowrap}.pi-drawer-overlay{position:fixed;inset:0;z-index:80;display:flex;justify-content:flex-end;background:rgb(17 25 45 / 22%);padding:0}.pi-drawer-panel{width:min(760px,calc(100vw - 16px));max-width:min(760px,calc(100vw - 16px));height:100vh;max-height:100vh;margin:0;padding:20px 24px;overflow-y:auto;overscroll-behavior:contain;background:var(--pc-color-surface);border:1px solid var(--pc-color-border);border-right:0;border-radius:var(--pc-radius-lg) 0 0 var(--pc-radius-lg);box-shadow:var(--pc-shadow-menu)}.pi-drawer-panel.pi-order-detail-dialog{width:min(900px,calc(100vw - 16px));max-width:900px}.pi-drawer-panel .pi-detail-heading{position:sticky;top:-20px;z-index:2;margin:-20px -24px 0;padding:18px 24px 14px;background:var(--pc-color-surface);border-bottom:1px solid var(--pc-color-border)}.pi-order-detail-items-wrap{max-height:330px;overflow:auto;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-md)}.pi-order-detail-items{min-width:2400px;margin:0}.pi-order-detail-items th,.pi-order-detail-items td{padding:8px 10px!important}.pi-order-detail-items td{font-size:11px}.pi-order-detail-terms{display:grid;gap:10px}.pi-order-detail-term-group{padding:12px 14px;border-radius:var(--pc-radius-md);background:var(--pc-color-surface-raised)}.pi-order-detail-term-group h5{margin:0 0 8px;color:var(--pc-color-text);font-size:12px;font-weight:650}.pi-order-detail-term-group ol{display:flex;flex-direction:column;gap:7px;margin:0;padding-left:20px;color:var(--pc-color-text-secondary);font-size:12px}.pi-order-detail-term-group li{padding-left:3px;white-space:pre-wrap;overflow-wrap:anywhere}.pi-order-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px}.pi-order-toolbar .pi-help{margin:4px 0 0}.pi-order-preview,.pi-order-errors{margin-top:12px;padding:10px;border:1px solid var(--pc-color-border);border-radius:var(--pc-radius-lg);background:var(--pc-color-surface-raised)}.pi-order-preview-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px}.pi-order-preview-selection{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.pi-order-select-all{display:inline-flex;align-items:center;gap:6px;color:var(--pc-color-text-secondary);font-size:11px;cursor:pointer}.pi-order-select-all .pi-check,.pi-order-preview-row .pi-check{margin:0}.pi-order-selected-count{color:var(--pc-color-text-muted);font-size:11px;white-space:nowrap}.pi-order-preview-actions{display:flex;align-items:center;gap:8px}.pi-order-preview-actions .pi-button{width:auto;white-space:nowrap}.pi-order-preview-list{display:flex;flex-direction:column;gap:6px;margin-top:8px}.pi-order-preview-row{display:grid;grid-template-columns:18px 1.1fr 1fr .7fr .7fr 1.6fr;gap:10px;align-items:center;padding:7px 8px;border-radius:var(--pc-radius-md);background:var(--pc-color-surface);font-size:11px}.pi-order-preview-row strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pi-order-preview-row span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pc-color-text-secondary)}.pi-order-errors{color:var(--pc-color-danger-text);font-size:11px}.pi-order-errors ul{margin:6px 0 0;padding-left:18px}.pi-order-list-heading{margin-top:18px}.pi-order-table{min-width:950px}.pi-order-table tbody tr.pi-order-row{cursor:pointer}.pi-order-expand{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:5px;border:0;border-radius:5px;background:transparent;color:var(--pc-color-text-secondary);font-size:18px;vertical-align:middle;cursor:pointer}.pi-order-expand:hover{background:var(--pc-color-neutral-bg)}.pi-order-detail-row td{background:var(--pc-color-surface-raised)!important}.pi-order-items-wrap{max-height:260px;margin-top:12px}.pi-order-items{min-width:820px}.pi-order-terms{margin-top:10px;color:var(--pc-color-text-secondary);font-size:11px}.pi-order-terms p{margin:5px 0}.pi-order-pagination{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:12px;color:var(--pc-color-text-secondary);font-size:11px}@media(max-width:600px){.pi-order-toolbar{align-items:flex-start;flex-direction:column}.pi-order-import-toolbar{align-items:flex-start;flex-direction:column}.pi-order-preview-toolbar{align-items:flex-start;flex-direction:column}.pi-order-preview-row{grid-template-columns:18px 1fr 1fr}.pi-drawer-panel,.pi-drawer-panel.pi-order-detail-dialog{width:100vw;max-width:100vw;padding:16px;border-radius:0}.pi-drawer-panel .pi-detail-heading{top:-16px;margin:-16px -16px 0;padding:16px}.pi-order-pagination{justify-content:space-between}}`

module.exports = { aiTableCSS, hildaUiCSS, copyCellCSS, masterDataCSS, hoverTooltipCSS, tableStickyCSS, interactionFixCSS, workspaceCSS, orderLayoutCSS, css }
