const express = require('express')
const app = express()

const serverPort = 8081

app.use(express.json())

app.get('/', (_, res) => {
  res.json({
    name: 'Money Wizard'
  })
})
const accounts = require('./src/accounts')
app.use(...accounts)

const transactions = require('./src/transactions')
app.use(...transactions)

app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
