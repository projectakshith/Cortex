require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const evaluateRoute = require('./routes/evaluate')
const healthRoute = require('./routes/health')
const historyRoute = require('./routes/history')

app.use('/api', evaluateRoute)
app.use('/api/health', healthRoute)
app.use('/api/history', historyRoute)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server on ${PORT}`)
})
