const extractClasses = (code) => {
  const matches = code.match(/class(?:Name)?=["']([^"']+)["']/g) || []
  const classes = new Set()
  matches.forEach(m => {
    const val = m.replace(/class(?:Name)?=["']/, '').replace(/["']$/, '')
    val.split(/\s+/).forEach(c => c && classes.add(c))
  })
  return classes
}

const diff = (rawCode, cleanCode) => {
  const before = extractClasses(rawCode)
  const after = extractClasses(cleanCode)
  return {
    removed: [...before].filter(c => !after.has(c)),
    added: [...after].filter(c => !before.has(c))
  }
}

module.exports = { diff }
