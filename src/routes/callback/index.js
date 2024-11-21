const express = require('express')

const hollatagRoutes = require('./hollatags/routes')
const nslRoutes = require('./nsl/routes')

const router = express.Router()

router.use('/hollatag', hollatagRoutes)
router.use('/nsl', nslRoutes)

module.exports = router
