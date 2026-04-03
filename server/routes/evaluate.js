const router = require('express').Router()
const axios = require('axios')
const model = require('../lib/gemini')
<<<<<<< HEAD

const SYSTEM_PROMPT = `You are an expert accessibility engineer and UI designer. The provided React/Tailwind code has been mathematically proven to cause high cognitive overload and visual strain in human users. Your job is to refactor this code to drop the cognitive load to zero.
=======
const { diff } = require('../lib/cssDiff')

const PROMPTS = {
  brutalist: `You are an expert accessibility engineer and UI designer. The provided React/Tailwind code has been mathematically proven to cause high cognitive overload and visual strain in human users. Your job is to refactor this code to drop the cognitive load to zero.
>>>>>>> 3ef5f75dd11588bb6b20775708c5c680755e3af6

RULES:
1. Strip out all chaotic CSS, unnecessary drop-shadows, rounded corners, and low-contrast gradients.
2. Rewrite the UI using a brutalist, high-contrast, minimalist aesthetic (stark white backgrounds, heavy black borders, black text, and pure red #dd2b37 for primary accents).
3. Flatten 'div-hell' by removing unnecessary nested wrappers.
<<<<<<< HEAD
4. Output ONLY the raw code. Do not include markdown formatting (like \`\`\`html), explanations, or conversational text. Start directly with the first HTML/JSX tag.`

router.post('/evaluate-ui', async (req, res) => {
  const { raw_code, image_base64 } = req.body
=======
4. Output ONLY the raw code. Do not include markdown formatting (like \`\`\`html), explanations, or conversational text. Start directly with the first HTML/JSX tag.`,

  minimal: `You are a minimalist UI engineer. Refactor the provided code to be as clean and simple as possible.

RULES:
1. Use only white backgrounds, light gray borders, and dark gray text.
2. Remove all decorative elements — no shadows, no gradients, no animations.
3. Use generous whitespace and a single sans-serif font.
4. Output ONLY the raw code. No markdown, no explanations. Start directly with the first HTML/JSX tag.`,

  accessible: `You are an accessibility-first UI engineer. Refactor the provided code to meet WCAG AA standards.

RULES:
1. Ensure all text has at least 4.5:1 contrast ratio.
2. All interactive elements must have visible focus states and ARIA labels.
3. Use semantic HTML elements (button, nav, main, section) instead of generic divs.
4. Output ONLY the raw code. No markdown, no explanations. Start directly with the first HTML/JSX tag.`
}

router.post('/evaluate-ui', async (req, res) => {
  const { raw_code, image_base64, style = 'brutalist' } = req.body
>>>>>>> 3ef5f75dd11588bb6b20775708c5c680755e3af6

  if (!raw_code || !image_base64) {
    return res.status(400).json({ error: 'missing fields' })
  }

  try {
    const brainData = {
      friction_score: 88,
      regions: {
        visual_cortex: 0.95,
        prefrontal: 0.82
      }
    }

    const score = brainData.friction_score

<<<<<<< HEAD
    if (score > 40) {
      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
=======
    const regionLabels = {
      visual_cortex: 'Visual Overload',
      prefrontal: 'Decision Fatigue',
      amygdala: 'Stress Response',
      hippocampus: 'Memory Load'
    }

    const labeledRegions = Object.fromEntries(
      Object.entries(brainData.regions).map(([k, v]) => [
        k, { score: v, label: regionLabels[k] || k }
      ])
    )

    const getSeverity = (s) => {
      if (s <= 25) return 'low'
      if (s <= 50) return 'medium'
      if (s <= 75) return 'high'
      return 'critical'
    }

    if (score > 40) {
      const prompt = PROMPTS[style] || PROMPTS.brutalist
      const result = await model.generateContent([
        { text: prompt },
>>>>>>> 3ef5f75dd11588bb6b20775708c5c680755e3af6
        { text: raw_code }
      ])
      const clean = result.response.text()

      return res.json({
        original_score: score,
<<<<<<< HEAD
        brain_regions: brainData.regions,
        ai_refactored: true,
        clean_code: clean
=======
        severity: getSeverity(score),
        brain_regions: labeledRegions,
        ai_refactored: true,
        clean_code: clean,
        css_diff: diff(raw_code, clean)
>>>>>>> 3ef5f75dd11588bb6b20775708c5c680755e3af6
      })
    }

    res.json({
      original_score: score,
<<<<<<< HEAD
      brain_regions: brainData.regions,
      ai_refactored: false,
      clean_code: null
=======
      severity: getSeverity(score),
      brain_regions: labeledRegions,
      ai_refactored: false,
      clean_code: null,
      tips: [
        'UI looks clean — cognitive load is low',
        'Consider increasing font size for better readability',
        'Ensure sufficient color contrast for accessibility',
        'Keep interactive elements clearly distinguishable'
      ]
>>>>>>> 3ef5f75dd11588bb6b20775708c5c680755e3af6
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
