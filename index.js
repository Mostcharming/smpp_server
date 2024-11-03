const dotenv = require('dotenv')

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

const server = app.listen(port, () => {
  console.log(`Express app running on port ${port}...`)
  console.log(process.env.NODE_ENV)
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
