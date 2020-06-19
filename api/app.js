const express = require('express')
const app = express()

app.use(express.json())

const controllers = require('./controllers')
app.use(controllers)

module.exports = app
