const moment = require('moment')

const express = require('express')
const router = express.Router()

const accountsRepo = require('../repositories/accounts')
const transactionsRepo = require('../repositories/transactions')

router.get('/', (_, res) => {
  transactionsRepo.getTransactions()
    .then((transactions) => res.json(transactions))
    .catch(() => {
      res.status(500)
        .json({
          msg: 'Transactions could not be loaded for an unknown reason.'
        })
    })
})

router.post('/', async (req, res) => {
  const {account: accountId, type, amount, date, notes} = req.body

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

  if (typeof date === 'undefined') {
    return res.status(400).json({
      msg: 'A date is required.'
    })
  }

  moment.suppressDeprecationWarnings = true;
  const parsedDate = moment(date)

  if (!parsedDate.isValid()) {
    return res.status(400).json({
      msg: 'A properly formatted date date is required. Try a format like: MM/DD/YYYY'
    })
  }

  const parsedAmount = parseFloat(amount)

  try {
    await transactionsRepo.createTransaction(accountId, type, parsedAmount, date, notes || '')
    res.sendStatus(201)
  } catch (err) {
    res.status(500)
      .json({
        msg: 'Transaction creation failed for an unknown reason.'
      })
  }
})

module.exports = ['/transactions', router]
