const express = require('express')
const uuid = require('uuid')

const router = express.Router()

const accounts = []

router.get('/', (_, res) => {
  res.json(accounts)
})

router.post('/', (req, res) => {
  res.sendStatus(500)
})

module.exports = ['/accounts', router]
