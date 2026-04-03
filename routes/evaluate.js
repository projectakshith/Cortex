const router = require('express').Router()

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

    res.json(brainData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
