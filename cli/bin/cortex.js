#!/usr/bin/env node
const { program } = require('commander')
const evaluate = require('../commands/evaluate')

program
  .name('cortex')
  .description('Cortex neuro-linter CLI')
  .version('1.0.0')
  .argument('[file]', 'HTML/CSS file to evaluate')
  .option('-i, --image <path>', 'Screenshot image (PNG/JPG)')
  .option('--server <url>', 'Server URL', 'http://localhost:3001')
  .option('-o, --output <path>', 'Write refactored code to file')
  .action((file, opts) => {
    if (!file) {
      program.help()
      return
    }
    evaluate({ file, ...opts })
  })

program
  .command('evaluate')
  .description('Evaluate a UI file for cognitive friction')
  .requiredOption('-f, --file <path>', 'HTML/CSS file to evaluate')
  .option('-i, --image <path>', 'Screenshot image (PNG/JPG)')
  .option('--server <url>', 'Server URL', 'http://localhost:3001')
  .option('-o, --output <path>', 'Write refactored code to file')
  .action(evaluate)

program.parse()
