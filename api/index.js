const express = require('express')
const app = express()

const serverPort = 8081

app.use((req, _, next) => {
  console.log(`Request for: ${req.originalUrl}`)
  next()
})

app.get('/', (_, res) => {
  res.json({
    name: 'Money Wizard'
  })
})

app.get('/transactions', (_, res) => {
  res.json([
    {
      id: '5fd9beba-5980-47ee-95cf-87e92c2d7b48',
      amount: 10.00,
      reason: 'Testing',
      date: '2020-05-01'
    }
  ])
})

app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
