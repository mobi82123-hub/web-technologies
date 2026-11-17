import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const sourceDirectory = path.join(projectRoot, 'src/assets/images/source')
const outputDirectory = path.join(projectRoot, 'public/images')
const reportPath = path.join(projectRoot, 'reports/image-sizes.json')
const widths = [320, 358]
const formats = ['avif', 'webp', 'jpg']

await mkdir(outputDirectory, { recursive: true })
await mkdir(path.dirname(reportPath), { recursive: true })

const sources = (await readdir(sourceDirectory))
  .filter((filename) => /\.(avif|jpe?g|png|webp)$/i.test(filename))
  .sort()

if (sources.length === 0) {
  throw new Error(`No source images found in ${sourceDirectory}`)
}

const report = {
  generatedAt: new Date().toISOString(),
  widths,
  sources: [],
  outputs: [],
  totals: { sourceBytes: 0, outputBytes: 0, byFormat: {} },
}

for (const filename of sources) {
  const sourcePath = path.join(sourceDirectory, filename)
  const sourceInfo = await stat(sourcePath)
  const assetName = path.parse(filename).name
  report.sources.push({ file: filename, bytes: sourceInfo.size })
  report.totals.sourceBytes += sourceInfo.size

  for (const width of widths) {
    for (const format of formats) {
      const extension = format === 'jpg' ? 'jpg' : format
      const outputName = `${assetName}-${width}.${extension}`
      const outputPath = path.join(outputDirectory, outputName)
      let image = sharp(sourcePath).rotate().resize({ width, withoutEnlargement: true })

      if (format === 'avif') image = image.avif({ quality: 48, effort: 5 })
      if (format === 'webp') image = image.webp({ quality: 76, effort: 5 })
      if (format === 'jpg') image = image.jpeg({ quality: 82, progressive: true, mozjpeg: true })

      await image.toFile(outputPath)
      const outputInfo = await stat(outputPath)
      report.outputs.push({ file: outputName, width, format, bytes: outputInfo.size })
      report.totals.outputBytes += outputInfo.size
      report.totals.byFormat[format] = (report.totals.byFormat[format] ?? 0) + outputInfo.size
    }
  }
}

report.totals.savingsAgainstSourceBytes = report.totals.sourceBytes - report.totals.outputBytes
report.totals.outputVariants = report.outputs.length
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)

console.log(
  `Optimized ${sources.length} source images into ${report.outputs.length} responsive files.`,
)
console.log(`Source WebP total: ${(report.totals.sourceBytes / 1024).toFixed(1)} KB`)
console.log(`Generated total: ${(report.totals.outputBytes / 1024).toFixed(1)} KB`)
console.log(`Report: ${path.relative(projectRoot, reportPath)}`)
