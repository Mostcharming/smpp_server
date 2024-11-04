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
    '/home/infonomics/ssl/keys/e5710_c3db1_59de9a13fed370ad386eb0c5a3d44630.key'
  ),
  cert: fs.readFileSync(
    '/home/infonomics/ssl/certs/infonomics_ng_e5710_c3db1_1727913599_93e87fe0a9e687882623ae9305c4d146.crt'
  )
}

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`App running on port ${port}...`)
})

startSMPPServer(smppPort)

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
