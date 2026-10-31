import { useTranslation } from '../../i18n'
import "./SmartTableSwitchingLoader.css";

export type SmartTableSwitchingLoaderProps = {
  title?: string;
  subtitle?: string;
  statusText?: string;
  askText?: string;
  className?: string;
};

const smartViewKeys = [
  { key: "allDocuments", type: "primary" },
  { key: "exceptionView", type: "green" },
  { key: "groupBySupplier", type: "" },
  { key: "arrivalTimeout", type: "orange" },
  { key: "quantityDiff", type: "" },
] as const

const tableRows = [
  { highlight: true, order: "line-lg", upstream: "line-md", type: "line-sm", status: "line-sm", supplier: "line-xl", quantity: "line-sm", time: "line-lg", ai: "line-70" },
  { highlight: false, order: "line-xl", upstream: "line-sm", type: "line-md", status: "line-sm", supplier: "line-lg", quantity: "line-sm", time: "line-xl", ai: "line-52" },
  { highlight: true, order: "line-lg", upstream: "line-md", type: "line-sm", status: "line-md", supplier: "line-xl", quantity: "line-xs", time: "line-lg", ai: "line-70" },
  { highlight: false, order: "line-xl", upstream: "line-sm", type: "line-md", status: "line-sm", supplier: "line-lg", quantity: "line-sm", time: "line-xl", ai: "line-52" },
];

const secondTableRows = [
  { highlight: true, order: "line-lg", upstream: "line-md", type: "line-sm", status: "line-sm", supplier: "line-xl", quantity: "line-sm", time: "line-lg", ai: "line-70" },
  { highlight: false, order: "line-xl", upstream: "line-sm", type: "line-md", status: "line-sm", supplier: "line-lg", quantity: "line-sm", time: "line-xl", ai: "line-52" },
];

const capabilityChipKeys = ["capabilityUnderstanding", "capabilityFiltering", "capabilityGrouping", "capabilityView"] as const

function SmartTableRow({
  highlight,
  order,
  upstream,
  type,
  status,
  supplier,
  quantity,
  time,
  ai,
}: {
  highlight: boolean;
  order: string;
  upstream: string;
  type: string;
  status: string;
  supplier: string;
  quantity: string;
  time: string;
  ai: string;
}) {
  return (
    <tr className={highlight ? "smart-table-ai-highlight" : undefined}>
      <td>
        <span className="smart-table-mini-checkbox" />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${order}`} />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${upstream}`} />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${type}`} />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${status}`} />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${supplier}`} />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${quantity}`} />
      </td>
      <td>
        <span className={`smart-table-skeleton-line ${time}`} />
      </td>
      <td className="smart-table-ai-column-cell">
        <div className="smart-table-cell-flex">
          <span className="smart-table-mini-ai-spark">AI</span>
          <span className={`smart-table-skeleton-line ${ai}`} />
        </div>
      </td>
    </tr>
  );
}

export function SmartTableSwitchingLoader({
  title,
  subtitle,
  statusText,
  askText,
  className = "",
}: SmartTableSwitchingLoaderProps) {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('aiTable.loader.title')
  const resolvedSubtitle = subtitle ?? t('aiTable.loader.subtitle')
  const resolvedStatusText = statusText ?? t('aiTable.loader.statusText')
  const resolvedAskText = askText ?? t('aiTable.loader.askText')
  return (
    <section className={`smart-table-loader-card ${className}`}>
      <div className="smart-table-loader-inner">
        <div className="smart-table-bg" />
        <div className="smart-table-shimmer" />

        <div className="smart-table-content">
          <header className="smart-table-loader-header">
            <div className="smart-table-loader-title-group">
              <div className="smart-table-ai-mark">AI</div>

              <div className="smart-table-loader-copy">
                <div className="smart-table-loader-title">
                  {resolvedTitle}
                  <span className="smart-table-dots" />
                </div>
                <div className="smart-table-loader-subtitle">{resolvedSubtitle}</div>
              </div>
            </div>

            <div className="smart-table-status-pill">
              <span className="smart-table-status-dot" />
              {resolvedStatusText}
            </div>
          </header>

          <section className="smart-table-toolbar">
            <div className="smart-table-ask-row">
              <div className="smart-table-ask-input">
                <span className="smart-table-ask-prefix-dot" />
                <span className="smart-table-ask-text">{resolvedAskText}</span>
              </div>

              <div className="smart-table-toolbar-btn secondary" aria-hidden="true" />
              <div className="smart-table-toolbar-btn" aria-hidden="true" />
            </div>

            <div className="smart-table-view-row">
              <span className="smart-table-view-label">{t('aiTable.loader.smartView')}</span>

              {smartViewKeys.map((view) => (
                <span
                  key={view.key}
                  className={`smart-table-view-chip ${view.type}`}
                >
                  <span className="smart-table-view-dot" />
                  {t(`aiTable.loader.${view.key}`)}
                </span>
              ))}
            </div>
          </section>

          <section className="smart-table-shell">
            <div className="smart-table-topbar">
              <div className="smart-table-topbar-left">
                <span className="smart-table-mini-checkbox" />
                <span className="smart-table-skeleton-line line-md" />
                <span className="smart-table-skeleton-line line-sm" />
              </div>

              <div className="smart-table-topbar-right">
                <span className="smart-table-skeleton-line line-sm" />
                <span className="smart-table-skeleton-line line-md" />
                <span className="smart-table-skeleton-line line-xs" />
              </div>
            </div>

            <table className="smart-table-skeleton" aria-label="smart table switching skeleton">
              <colgroup>
                <col style={{ width: 46 }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>
                    <span className="smart-table-mini-checkbox" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-md" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-sm" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-sm" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-sm" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-md" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-sm" />
                  </th>
                  <th>
                    <span className="smart-table-skeleton-line line-md" />
                  </th>
                  <th className="smart-table-ai-column">
                    <span className="smart-table-skeleton-line line-sm" />
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="smart-table-group-row">
                  <td colSpan={9}>
                    <div className="smart-table-group-label">
                      <span className="smart-table-group-label-dot" />
                      {t('aiTable.loader.creatingGroup')}
                      <span className="smart-table-group-line" />
                    </div>
                  </td>
                </tr>

                {tableRows.map((row, index) => (
                  <SmartTableRow key={index} {...row} />
                ))}

                <tr className="smart-table-group-row">
                  <td colSpan={9}>
                    <div className="smart-table-group-label">
                      <span className="smart-table-group-label-dot" />
                      {t('aiTable.loader.generatingView')}
                      <span className="smart-table-group-line" />
                    </div>
                  </td>
                </tr>

                {secondTableRows.map((row, index) => (
                  <SmartTableRow key={`second-${index}`} {...row} />
                ))}
              </tbody>
            </table>

            <div className="smart-table-footer-status">
              <div className="smart-table-capability-chips">
                {capabilityChipKeys.map((chipKey) => (
                  <span className="smart-table-capability-chip" key={chipKey}>
                    <span className="smart-table-capability-dot" />
                    {t(`aiTable.loader.${chipKey}`)}
                  </span>
                ))}
              </div>

              <div className="smart-table-progress-group">
                <span className="smart-table-progress-text">Upgrading table</span>
                <span className="smart-table-mini-progress" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
