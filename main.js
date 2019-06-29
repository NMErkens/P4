const express = require('express')
const appartmentsRoutes = require('./src/routes/appartments.routes')
const reservationsRoutes = require('./src/routes/reservations.routes')
const authenticationRoutes = require('./src/routes/authentication.routes')
const logger = require('tracer').console();
 
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// Generic endpoint handler - voor alle routes
app.all('*', (req, res, next) => {
  // logger.info('Generieke afhandeling aangeroepen!')
  // ES16 deconstructuring
  const { method, url } = req
  logger.info(`${method} ${url}`)
  next()
})

// Hier installeren we de routes
app.use('/api', authenticationRoutes)
app.use('/api/appartments', appartmentsRoutes)
app.use('/api/reservations', reservationsRoutes)

// Handle endpoint not found.
app.all('*', (req, res, next) => {
  logger.error('Endpoint not found.')
  const errorObject = {
    message: 'Endpoint does not exist!',
    code: 404,
    date: new Date()
  }
  next(errorObject)
})

// Error handler
app.use((error, req, res, next) => {
  logger.error('Error handler: ', error.message.toString())
  res.status(error.code).json(error)
})

app.listen(port, () => logger.info(`Example app listening on port ${port}!`))


module.exports = app

//terminal code
// npm test (om te testen)
// npm run dev (om te starten met auto update op ctrl + s)