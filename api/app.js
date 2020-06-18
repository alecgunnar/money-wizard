const express = require('express')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
  next()
  console.log(`${req.method} => ${req.originalUrl}`)
})

const accounts = require('./controllers/accounts')
app.use(...accounts)

const transactions = require('./controllers/transactions')
app.use(...transactions)

module.exports = app
