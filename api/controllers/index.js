const express = require('express')
const router = express.Router()

require('./createAccount')(router)
require('./getAccounts')(router)
require('./getAccount')(router)
require('./createTransaction')(router)
require('./getTransactions')(router)
require('./deleteTransaction')(router)
require('./reconcileAccount')(router)

module.exports = router
