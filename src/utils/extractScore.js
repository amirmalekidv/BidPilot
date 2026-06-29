export function extractScore(text) {
  const patterns = [
    /نمره\s*نهایی[:\s]*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*\/\s*10/,
    /(\d+(?:\.\d+)?)\s*از\s*10/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const score = parseFloat(match[1])
      if (!Number.isNaN(score)) {
        return Math.min(10, Math.max(1, Math.round(score * 10) / 10))
      }
    }
  }

  return null
}
