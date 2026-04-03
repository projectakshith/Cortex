const express = require('express')
const app = express()

app.use(express.json({ limit: '10mb' }))

const PORT = 3001

app.listen(PORT, () => {
  console.log(`server on ${PORT}`)
})
