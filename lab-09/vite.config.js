import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/web-technologies/' : '/',
  root: projectRoot,
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: path.resolve(projectRoot, 'src') }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
      '@assets': path.resolve(projectRoot, 'src/assets'),
    },
  },
})
