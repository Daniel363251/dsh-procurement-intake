import React from 'react'
import { ResponsiveContainer } from 'recharts'
const h = React.createElement

// shadcn/ui ChartContainer pattern: a themed, responsive wrapper around Recharts.
function ChartContainer({ id, config = {}, className = '', children }) {
  const style = Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]))
  return h('div', {
    id,
    className: `pi-chart-container ${className}`.trim(),
    style,
    'data-chart': id || 'procurement',
  }, h(ResponsiveContainer, { width: '100%', height: '100%' }, children))
}

function ChartTooltipContent({ active, payload = [], label, config = {}, labelFormatter, formatter }) {
  if (!active || !payload.length) return null
  const title = labelFormatter ? labelFormatter(label) : label
  return h('div', { className: 'pi-chart-tooltip' },
    title != null && h('div', { className: 'pi-chart-tooltip-title' }, title),
    ...payload.map((entry) => {
      const key = entry.dataKey || entry.name
      const definition = config[key] || {}
      const shown = formatter ? formatter(entry.value, key, entry) : entry.value
      return h('div', { className: 'pi-chart-tooltip-row', key },
        h('span', { className: 'pi-chart-tooltip-dot', style: { background: definition.color || entry.color } }),
        h('span', null, definition.label || entry.name || key),
        h('strong', null, shown))
    }))
}

export { ChartContainer, ChartTooltipContent }
