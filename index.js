const dotenv = require('dotenv')
const https = require('https')
const fs = require('fs')

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  console.log(err)
  process.exit(1)
})

dotenv.config()
const app = require('./src/components/service/api/index')
const { startSMPPServer } = require('./src/components/service/smpp/index')

const port = process.env.PORT || 8080
const smppPort = process.env.SMPP_PORT || 2775

// const server = app.listen(port, () => {
//   console.log(`Express app running on port ${port}...`)
// })
const sslOptions = {
  key: fs.readFileSync(
    '/home/infonomics/ssl/keys/dc7af_3f72b_66ea18e4aafd4eeb88cc7542815245be.key'
  ),
  cert: fs.readFileSync(
    '/home/infonomics/ssl/certs/infonomics_ng_dc7af_3f72b_1734479999_dcd2fd960d0a899115679ccaf0294bf2.crt'
  )
}

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`App running on port ${port}...`)
})

//startSMPPServer(smppPort)

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    console.log('💥 Process terminated!')
  })
})
