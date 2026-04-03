require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json({ limit: '10mb' }))

const evaluateRoute = require('./routes/evaluate')
app.use('/api', evaluateRoute)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server on ${PORT}`)
})
