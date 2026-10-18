const React = require('react')

function useTruncatedCellTooltip(rootRef) {
  React.useEffect(() => {
    const root = rootRef.current
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
}

module.exports = { useTruncatedCellTooltip }
