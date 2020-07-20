const AccountsRepository = require('../repositories/accounts')
const BalanceService = require('../services/balances')

const addBalanceToAccount = async (account) => {
  const balance = await BalanceService.calculateBalanceForAccount(account)
  const reconciledBalance = await BalanceService.getReconciledBalance(account)
  return {
    ...account,
    balance,
    reconciledBalance
  }
}

module.exports = (router) => {
  router.get('/accounts/:id', (req, res) => {
    const {id} = req.params
    AccountsRepository.getAccount(parseInt(id))
      .then(async (account) => await addBalanceToAccount(account))
      .then((account) => res.send(account))
      .catch(() => {
        res.status(500)
          .send({
            msg: 'Could not retrieve account for an unknown reason.'
          })
      })
  })
}
