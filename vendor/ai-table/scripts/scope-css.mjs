import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import postcss from 'postcss'

// 读取 vite 产物 dist/ai-table.css，为所有选择器加 .ai-table-plugin 作用域，
// 然后连同 dist/ai-table.js 一起发布到 vendor/ai-table/ 根（client 构建的 alias 入口）。
const file = new URL('../dist/ai-table.css', import.meta.url)
const tree = postcss.parse(readFileSync(file, 'utf8'))
tree.walkRules((rule) => {
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/.test(parent.name)) return
    if (parent.type === 'rule') return // nested selectors inherit the outer scope
  }
  rule.selectors = rule.selectors.map((selector) => {
    if (/:root|:host/.test(selector)) return selector.replace(/:root|:host/g, '.ai-table-plugin')
    return `.ai-table-plugin ${selector}`
  })
})
writeFileSync(new URL('../ai-table.css', import.meta.url), tree.toString() + '\n.ai-table-plugin{color:var(--foreground);font:14px/1.5 var(--font-sans)}\n')
copyFileSync(new URL('../dist/ai-table.js', import.meta.url), new URL('../ai-table.js', import.meta.url))
console.log('CSS scoped to table and portal roots; artifacts published to vendor/ai-table/')
