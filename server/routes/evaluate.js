const router = require('express').Router()
const axios = require('axios')
const model = require('../lib/gemini')

const SYSTEM_PROMPT = `You are an expert accessibility engineer and UI designer. The provided React/Tailwind code has been mathematically proven to cause high cognitive overload and visual strain in human users. Your job is to refactor this code to drop the cognitive load to zero.

RULES:
1. Strip out all chaotic CSS, unnecessary drop-shadows, rounded corners, and low-contrast gradients.
2. Rewrite the UI using a brutalist, high-contrast, minimalist aesthetic (stark white backgrounds, heavy black borders, black text, and pure red #dd2b37 for primary accents).
3. Flatten 'div-hell' by removing unnecessary nested wrappers.
4. Output ONLY the raw code. Do not include markdown formatting (like \`\`\`html), explanations, or conversational text. Start directly with the first HTML/JSX tag.`

router.post('/evaluate-ui', async (req, res) => {
  const { raw_code, image_base64 } = req.body

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
      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: raw_code }
      ])
      const clean = result.response.text()

      return res.json({
        original_score: score,
        severity: getSeverity(score),
        brain_regions: labeledRegions,
        ai_refactored: true,
        clean_code: clean
      })
    }

    res.json({
      original_score: score,
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
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
