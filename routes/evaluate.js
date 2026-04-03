const router = require('express').Router()

router.post('/evaluate-ui', async (req, res) => {
  const { raw_code, image_base64 } = req.body

  if (!raw_code || !image_base64) {
    return res.status(400).json({ error: 'missing fields' })
  }

  try {
    res.json({ status: 'ok' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
