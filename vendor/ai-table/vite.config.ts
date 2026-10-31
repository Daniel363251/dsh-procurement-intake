import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// external：构建时排除的依赖，由插件仓库的 client 构建在打包时解析
// （src/ fork 自 @enterprise/ai-table，其 dependencies + peerDependencies 集合）
const external = [
  'react', 'react-dom',
  '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities',
  '@tanstack/react-table',
  'class-variance-authority', 'clsx', 'tailwind-merge',
  'lucide-react', 'radix-ui',
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'ai-table', cssFileName: 'ai-table' },
    rollupOptions: { external: (id) => external.some((name) => id === name || id.startsWith(name + '/')) },
    outDir: 'dist',
    sourcemap: true,
  },
})
