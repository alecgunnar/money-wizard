const express = require('express')
const router = express.Router()

require('./createAccount')(router)
require('./getAccounts')(router)
require('./createTransaction')(router)
require('./getTransactions')(router)

module.exports = router
