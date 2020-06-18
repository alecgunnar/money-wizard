const express = require('express')
const router = express.Router()

const accountsRepo = require('../repositories/accounts')

router.get('/', (_, res) => {
  res.json([])
})

router.post('/', async (req, res) => {
  const {account: accountId, type, amount} = req.body

  if (typeof accountId === 'undefined') {
    return res.status(400).json({
      msg: 'An account is required.'
    })
  }

  const account =  await accountsRepo.getAccount(accountId)

  if (account === null) {
    return res.status(400).json({
      msg: 'An account with the id provided does not exist.'
    })
  }

  if (typeof type === 'undefined') {
    return res.status(400).json({
      msg: 'A type is required.'
    })
  }

  if (typeof amount === 'undefined') {
    return res.status(400).json({
      msg: 'An amount is required.'
    })
  }

  if (amount <= 0) {
    return res.status(400).json({
      msg: 'An amount which is greater than zero is required.'
    })
  }

  res.json({})
})

module.exports = ['/transactions', router]
