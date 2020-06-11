const express = require('express')
const app = express()

const serverPort = 8081

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

app.get('/accounts', (_, res) => {
  res.json([
    {
      id: '32f4ccf3-8d3c-4182-b0ca-8139bf0233ba',
      name: 'Checking Account',
      balance: 1421.45
    },
    {
      id: '12263d1a-f875-4505-ab53-7c40d1991039',
      name: 'Savings Account',
      balance: 422532.57
    }
  ])
})

app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
