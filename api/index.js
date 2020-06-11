const express = require('express')
const app = express()

const serverPort = 8081

app.get('/', (_, res) => {
  res.json({
    name: 'Money Wizard'
  })
})

app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
