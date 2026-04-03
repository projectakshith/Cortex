const router = require('express').Router()
const { get } = require('../lib/history')

router.get('/history', (req, res) => {
  res.json(get())
})

module.exports = router
