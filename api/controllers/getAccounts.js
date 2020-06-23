const AccountsRepository = require('../repositories/accounts')
const BalanceService = require('../services/balances')

const addBalanceToAccount = async (account) => {
  const balance = await BalanceService.calculateBalanceForAccount(account)
  return {
    ...account,
    balance
  }
}

module.exports = (router) => {
  router.get('/accounts', (_, res) => {
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
}
