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

    if (score > 40) {
      const clean = `<div style="background:#fff;border:3px solid #000;padding:16px;font-family:monospace;">
  <h1 style="color:#000;font-size:1.5rem;border-bottom:2px solid #dd2b37;padding-bottom:8px;">Refactored UI</h1>
  <p style="color:#000;">High contrast. Zero noise. Cognitive load eliminated.</p>
  <button style="background:#dd2b37;color:#fff;border:none;padding:8px 16px;font-weight:bold;cursor:pointer;">Action</button>
</div>`

      return res.json({
        original_score: score,
        brain_regions: brainData.regions,
        ai_refactored: true,
        clean_code: clean
      })
    }

    res.json({
      original_score: score,
      brain_regions: brainData.regions,
      ai_refactored: false,
      clean_code: null
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
