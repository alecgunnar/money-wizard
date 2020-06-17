const express = require('express')
const app = express()

app.use(express.json())

const accounts = require('./src/accounts')
app.use(...accounts)

const transactions = require('./src/transactions')
app.use(...transactions)

module.exports = app
