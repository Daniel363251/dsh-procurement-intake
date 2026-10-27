import { build } from 'esbuild'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const outputDir = join(root, 'dist')
await mkdir(outputDir, { recursive: true })

const shared = {
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  minify: true,
  external: ['@deepseek-ai/*'],
  legalComments: 'eof',
}

await Promise.all([
  build({ ...shared, entryPoints: [join(root, 'src/host/index.js')], outfile: join(outputDir, 'index.js') }),
  build({ ...shared, entryPoints: [join(root, 'remote-def.js')], outfile: join(outputDir, 'remote-def.js') }),
])
