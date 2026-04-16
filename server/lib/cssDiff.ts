const extractClasses = (code: string): Set<string> => {
  const matches = code.match(/class(?:Name)?=["']([^"']+)["']/g) || [];
  const classes = new Set<string>();
  matches.forEach(m => {
    const val = m.replace(/class(?:Name)?=["']/, '').replace(/["']$/, '');
    val.split(/\s+/).forEach(c => c && classes.add(c));
  });
  return classes;
};

export const diff = (rawCode: string, cleanCode: string) => {
  const before = extractClasses(rawCode);
  const after = extractClasses(cleanCode);
  return {
    removed: [...before].filter(c => !after.has(c)),
    added: [...after].filter(c => !before.has(c))
  };
};
