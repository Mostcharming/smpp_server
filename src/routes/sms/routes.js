const express = require('express')
const sendNotification = require('./controller')

const router = express.Router()

router.post('/send_notification', sendNotification.sendNotification)

module.exports = router
