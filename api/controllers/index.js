const express = require('express')
const router = express.Router()

require('./createAccount')(router)

module.exports = router
