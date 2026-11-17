import { rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const source = path.join(projectRoot, 'dist', 'index.pug.html')
const destination = path.join(projectRoot, 'dist', 'index.html')

await rename(source, destination)
