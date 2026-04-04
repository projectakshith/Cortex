const fs = require('fs')
const path = require('path')
const axios = require('axios')
const chalk = require('chalk')
const ora = require('ora')

const SEVERITY_COLOR = {
  low: chalk.green,
  medium: chalk.yellow,
  high: chalk.red,
  critical: chalk.bgRed.white,
}

const BAR_WIDTH = 20

function scoreBar(score) {
  const filled = Math.round((score / 100) * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  return chalk.cyan('█'.repeat(filled)) + chalk.gray('░'.repeat(empty))
}

function regionBar(val) {
  const filled = Math.round(val * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  return chalk.magenta('█'.repeat(filled)) + chalk.gray('░'.repeat(empty))
}

module.exports = async function evaluate(opts) {
  const filePath = path.resolve(opts.file)
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`File not found: ${filePath}`))
    process.exit(1)
  }

  const raw_code = fs.readFileSync(filePath, 'utf8')

  let image_base64 = null
  if (opts.image) {
    const imgPath = path.resolve(opts.image)
    if (!fs.existsSync(imgPath)) {
      console.error(chalk.red(`Image not found: ${imgPath}`))
      process.exit(1)
    }
    image_base64 = fs.readFileSync(imgPath).toString('base64')
  }

  console.log()
  console.log(chalk.cyan('  ⬡ CORTEX') + chalk.gray(' neuro-linter v1.0'))
  console.log(chalk.gray('  ─────────────────────────────────'))
  console.log()

  const spinner = ora({ text: chalk.gray('  analyzing cognitive load...'), spinner: 'dots' }).start()

  let data
  try {
    const payload = { raw_code, image_base64 }
    if (opts.score !== undefined) payload.demo_score = parseInt(opts.score)
    const res = await axios.post(`${opts.server}/api/evaluate-ui`, payload)
    data = res.data
    spinner.stop()
  } catch (err) {
    spinner.stop()
    const msg = err.response?.data?.error || err.message
    console.error(chalk.red(`  error: ${msg}`))
    process.exit(1)
  }

  const { original_score, severity, brain_regions, clean_code, css_diff } = data
  const sevColor = SEVERITY_COLOR[severity] || chalk.white

  console.log(`  ${chalk.gray('Friction Score')}   ${scoreBar(original_score)}  ${chalk.white.bold(original_score + ' / 100')}  ${sevColor('[' + severity.toUpperCase() + ']')}`)
  console.log()

  if (brain_regions && Object.keys(brain_regions).length) {
    console.log(chalk.gray('  Brain Regions'))
    for (const [, region] of Object.entries(brain_regions)) {
      const label = region.label || 'Unknown'
      const val = region.score || 0
      const padded = label.padEnd(22)
      console.log(`  ${chalk.gray(padded)} ${regionBar(val)}  ${chalk.white((val * 100).toFixed(0) + '%')}`)
    }
    console.log()
  }

  if (css_diff) {
    const { removed = [], added = [] } = css_diff
    if (removed.length || added.length) {
      console.log(chalk.gray('  CSS Changes'))
      removed.forEach(c => console.log(`  ${chalk.red('- ' + c)}`))
      added.forEach(c => console.log(`  ${chalk.green('+ ' + c)}`))
      console.log()
    }
  }

  if (clean_code) {
    const outputPath = opts.output || filePath.replace(/(\.\w+)$/, '.fixed$1')
    fs.writeFileSync(outputPath, clean_code, 'utf8')
    console.log(`  ${chalk.gray('Refactored code')}  → ${chalk.cyan(outputPath)}`)
    console.log()
  }

  console.log(chalk.gray('  ─────────────────────────────────'))
  console.log()
}
