const moment = require('moment')

const AccountsRepo = require('../repositories/accounts')
const TransactionsRepo = require('../repositories/transactions')

module.exports = (router) => {
  router.post('/transactions', async (req, res) => {
    const {account: accountId, type, amount, date, reason, notes} = req.body

    if (typeof accountId === 'undefined') {
      return res.status(400).json({
        msg: 'An account is required.'
      })
    }

    const account =  await AccountsRepo.getAccount(accountId)

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

    if (typeof reason === 'undefined') {
      return res.status(400).json({
        msg: 'A reason is required.'
      })
    }

    if (reason === '') {
      return res.status(400).json({
        msg: 'A non-empty reason is required.'
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
      await TransactionsRepo.createTransaction(
        accountId,
        type,
        parsedAmount,
        parsedDate.format('YYYY-MM-DD'),
        reason,
        notes || ''
      )

      res.sendStatus(201)
    } catch (err) {
      res.status(500)
        .json({
          msg: 'Transaction creation failed for an unknown reason.'
        })
    }
  })
}
