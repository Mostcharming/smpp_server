const express = require('express')
const router = express.Router()
const hollatagController = require('./controller.js')

router.post('/', hollatagController.callback)

module.exports = router
