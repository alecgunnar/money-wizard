const AccountsRepository = require('../repositories/accounts')
const BalanceService = require('../services/balances')

const express = require('express')
const router = express.Router()

const addBalanceToAccount = async (account) => {
  const balance = await BalanceService.calculateBalanceForAccount(account.id)
  return {
    ...account,
    balance
  }
}

router.get('/', (_, res) => {
  AccountsRepository.getAccounts()
    .then(async (accounts) => await Promise.all(accounts.map(addBalanceToAccount)))
    .then((accounts) => res.send(accounts))
    .catch(() => {
      res.status(500)
        .send({
          msg: 'Could not retrieve all accounts for an unknown reason.'
        })
    })
})

router.post('/', (req, res) => {
  const {name, type} = req.body

  if (typeof name === 'undefined') {
    return res.status(401).send({
      msg: 'A name is required.'
    })
  }

  if (name === '') {
    return res.status(401).send({
      msg: 'A non-empty name is required.'
    })
  }

  if (typeof type === 'undefined') {
    return res.status(401).send({
      msg: 'A type is required.'
    })
  }

  if (['asset', 'credit'].indexOf(type) === -1) {
    return res.status(401).send({
      msg: 'The supplied type is not valid. Valid types are "asset" and "credit".'
    })
  }

  AccountsRepository.createAccount(name, type)
    .then(() => res.sendStatus(201))
    .catch(() => {
      res.status(500)
        .send({
          msg: 'Account creation failed for an unknown reason.'
        })
    })
})

module.exports = ['/accounts', router]
