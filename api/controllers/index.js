const express = require('express')
const router = express.Router()

require('./createAccount')(router)
require('./getAccounts')(router)

module.exports = router
