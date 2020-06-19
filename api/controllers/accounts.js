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

module.exports = ['/accounts', router]
