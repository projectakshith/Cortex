const router = require('express').Router()

router.post('/evaluate-ui', (req, res) => {
  res.json({ msg: 'hit' })
})

module.exports = router
