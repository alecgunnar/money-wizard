const express = require('express')
const app = express()

const serverPort = 8081

app.get('/', (_, res) => {
  res.json({
    name: 'Money Wizard'
  })
})

app.get('/transactions', (_, res) => {
  res.json([])
})

const accounts = require('./src/accounts')
app.use(...accounts)

app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
