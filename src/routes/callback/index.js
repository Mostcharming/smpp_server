const express = require('express')

const hollatagRoutes = require('./hollatags/routes')

const router = express.Router()

router.use('/hollatag', hollatagRoutes)

module.exports = router
