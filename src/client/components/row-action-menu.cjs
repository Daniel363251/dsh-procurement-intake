const React = require('react')
const { DropdownMenu } = require('radix-ui')
const h = React.createElement

function renderRowActionMenu(label, items) {
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
module.exports = { renderRowActionMenu }
