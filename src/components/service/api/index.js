const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
//const helmet = require('helmet')

const routes = require('../../../routes/client/index')
const smsRoutes = require('../../../routes/sms/routes')
const callbackRoutes = require('../../../routes/callback/index')

const app = express()

const whitelist = ['http://localhost:3000', 'https://gateway.infonomics.ng']
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true)
    } else if (whitelist.indexOf(origin) === -1) {
      return callback(new Error('not allowed by CORS'), false)
    }
    return callback(null, true)
  }
}

app.use((req, res, next) => {
  if (!req.path.startsWith('/sms')) {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, PUT, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  next()
})

app.use(cors(corsOptions))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'fail',
    message: 'Too many requests, please try again later'
  }
})
//app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiVersion = process.env.API_VERSION || 'v1'

app.use(`/api/${apiVersion}`, routes)
app.use('/callback', callbackRoutes)

app.use('/sms', (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey && apiKey === 'Inf0n0mics!S^M$G@t3way') {
    next()
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Invalid API key'
    })
  }
})

app.use('/sms', smsRoutes)

app.all('*', (err, req, res, next) => {
  const status = err.code || 500
  res.status(status).json({ message: err.message })
})

module.exports = app
