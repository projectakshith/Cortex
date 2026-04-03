require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const evaluateRoute = require('./routes/evaluate')
<<<<<<< HEAD
app.use('/api', evaluateRoute)
=======
const healthRoute = require('./routes/health')
const historyRoute = require('./routes/history')
app.use('/api', evaluateRoute)
app.use('/api', healthRoute)
app.use('/api', historyRoute)
>>>>>>> 3ef5f75dd11588bb6b20775708c5c680755e3af6

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server on ${PORT}`)
})
