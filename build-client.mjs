import { build } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const aiTableStyles = await readFile(join(root, 'vendor/ai-table/ai-table.css'), 'utf8')
const sharedControlsStyles = await readFile(join(root, 'vendor/hilda-ui/controls.css'), 'utf8')
const result = await build({
  entryPoints: [join(root, 'client.source.cjs')],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  external: ['react', 'react-dom'],
  alias: { '@enterprise/ai-table': join(root, 'vendor/ai-table/ai-table.js') },
  define: { __AI_TABLE_CSS__: JSON.stringify(aiTableStyles), __HILDA_UI_CSS__: JSON.stringify(sharedControlsStyles) },
  minify: true,
  legalComments: 'eof',
})
const bundle = result.outputFiles[0].text
const output = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(manifest.name)},\n  factory(require) {\n    var module = { exports: {} }\n    var exports = module.exports\n${bundle}\n    return module.exports\n  },\n})\n`
await writeFile(join(root, 'client.js'), output)
