const express = require('express')
const router = express.Router()
const nslController = require('./controller.js')

router.post('/', nslController.callback)

module.exports = router
