const repo = require('./repository')

const express = require('express')
const router = express.Router()

router.get('/', (_, res) => {
  res.json(repo.getAccounts())
})

router.post('/', (req, res) => {
  const {name, type} = req.body

  if (typeof name === 'undefined') {
    return res.status(401).send({
      msg: 'A name is required'
    })
  }

  if (typeof type === 'undefined') {
    return res.status(401).send({
      msg: 'A type is required'
    })
  }

  if (['asset', 'credit'].indexOf(type) === -1) {
    return res.status(401).send({
      msg: 'The supplied type is not valid. Valid types are "asset" and "credit".'
    })
  }

  repo.createAccount(name, type)
  res.sendStatus(201)
})

module.exports = ['/accounts', router]
