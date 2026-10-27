const React = require('react')
const h = React.createElement

function normalize(value) {
  return String(value ?? '').trim().replace(/[\s\u00a0]/g, '').toLowerCase()
}

function isSubsequence(needle, value) {
  let index = 0
  for (const character of value) {
    if (character === needle[index]) index += 1
    if (index === needle.length) return true
  }
  return false
}

function SupplierPicker({ data, t, value, onChange, disabled = false, placeholder, autoFocus = false }) {
  const [query, setQuery] = React.useState(value || '')
  const [suppliers, setSuppliers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => setQuery(value || ''), [value])
  React.useEffect(() => {
    let active = true
    data.listMasterData('suppliers').then(result => {
      if (active) setSuppliers((result.rows || []).filter(row => String(row?.name ?? '').trim()))
    }).catch(caught => {
      if (active) setError(caught instanceof Error ? caught.message : String(caught))
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [data])

  const needle = normalize(query)
  const matches = needle ? suppliers.map(supplier => {
    const name = normalize(supplier.name)
    const rank = name.startsWith(needle) ? 0 : name.includes(needle) ? 1 : isSubsequence(needle, name) ? 2 : -1
    return { supplier, rank }
  }).filter(item => item.rank >= 0)
    .sort((left, right) => left.rank - right.rank || left.supplier.name.localeCompare(right.supplier.name, 'zh-CN'))
    .slice(0, 8) : []
  const exactMatch = suppliers.some(supplier => normalize(supplier.name) === needle)

  function choose(name) {
    onChange(name)
    setQuery(name)
    setOpen(false)
    setError('')
  }

  async function addSupplier() {
    const name = query.trim()
    if (!name || saving) return
    const existing = suppliers.find(supplier => normalize(supplier.name) === normalize(name))
    if (existing) {
      choose(existing.name)
      return
    }
    setSaving(true)
    setError('')
    try {
      const saved = await data.saveMasterData('suppliers', { name })
      setSuppliers(current => [...current, saved].sort((left, right) => left.name.localeCompare(right.name, 'zh-CN')))
      choose(saved.name)
    } catch (caught) {
      try {
        const latest = await data.listMasterData('suppliers')
        const existingAfterSave = (latest.rows || []).find(supplier => normalize(supplier.name) === normalize(name))
        if (existingAfterSave) {
          setSuppliers(latest.rows || [])
          choose(existingAfterSave.name)
          return
        }
      } catch {}
      setError(caught instanceof Error ? caught.message : t('supplierAddError'))
    } finally {
      setSaving(false)
    }
  }

  return h('div', {
    className: 'pi-supplier-picker',
    onBlur: event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) },
  },
    h('input', {
      className: 'pi-input pi-detail-input',
      type: 'text',
      role: 'combobox',
      autoComplete: 'off',
      'aria-autocomplete': 'list',
      'aria-expanded': open,
      'aria-controls': 'pi-supplier-options',
      value: query,
      disabled: disabled || saving,
      autoFocus,
      placeholder,
      onFocus: () => setOpen(true),
      onChange: event => { setQuery(event.target.value); setError(''); setOpen(true) },
      onKeyDown: event => {
        if (event.key === 'Escape') setOpen(false)
        if (event.key === 'Enter' && open) {
          event.preventDefault()
          if (matches.length) choose(matches[0].supplier.name)
          else if (needle && !exactMatch) void addSupplier()
        }
      },
    }),
    open && h('div', { id: 'pi-supplier-options', className: 'pi-supplier-options', role: 'listbox' },
      loading ? h('div', { className: 'pi-supplier-option pi-supplier-option--muted' }, t('supplierLoading')) : null,
      !loading && value && h('button', {
        type: 'button',
        className: 'pi-supplier-option pi-supplier-option--muted',
        role: 'option',
        onMouseDown: event => event.preventDefault(),
        onClick: () => choose(''),
      }, t('supplierClear')),
      !loading && matches.map(({ supplier }) => h('button', {
        key: supplier.id,
        type: 'button',
        className: 'pi-supplier-option',
        role: 'option',
        'aria-selected': supplier.name === value,
        onMouseDown: event => event.preventDefault(),
        onClick: () => choose(supplier.name),
      }, supplier.name)),
      !loading && needle && !exactMatch && h('button', {
        type: 'button',
        className: 'pi-supplier-option pi-supplier-option--add',
        disabled: saving,
        onMouseDown: event => event.preventDefault(),
        onClick: () => void addSupplier(),
      }, saving ? t('saving') : t('supplierAddOption').replace('{name}', query.trim())),
      !loading && needle && !matches.length ? h('div', { className: 'pi-supplier-option pi-supplier-option--muted' }, t('supplierNoMatches')) : null),
    error && h('span', { className: 'pi-supplier-error', role: 'alert' }, error))
}

module.exports = { SupplierPicker }
