const AccountsRepository = require('../repositories/accounts')
const TransactionsRepository = require('../repositories/transactions')
const ReconciliationService = require('../services/reconciliation')

module.exports = (router) => {
  router.post('/accounts/:id/reconcile', async (req, res) => {
    const {balance, transactions} = req.body;

    if (!balance) {
      return res.status(400).json({
        msg: 'A balance must be provided.'
      })
    }

    if (!transactions) {
      return res.status(400).json({
        msg: 'A list of transactions must be provided.'
      })
    }

    if (!Array.isArray(transactions)) {
      return res.status(400).json({
        msg: 'The field transactions must be a list of transaction id\'s.'
      })
    }

    const {id} = req.params
    const account = await AccountsRepository.getAccount(id)

    if (!account) {
      return res.status(404).json({
        msg: 'The account does not exist.'
      })
    }

    const loadedTransactions = []

    for (let transactionId of transactions) {
      const transaction = await TransactionsRepository.getTransaction(transactionId)
      if (!transaction) {
        return res.status(400).json({
          msg: 'One or more transaction id\'s are not valid.'
        })
      }
      loadedTransactions.push(transaction)
    }

    ReconciliationService.reconcileAccount(account, balance, loadedTransactions)
      .then(() => res.sendStatus(201))
      .catch(() => res.sendStatus(500))
  })
}