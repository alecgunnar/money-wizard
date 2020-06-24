const TransactionsRepo = require('../repositories/transactions')

module.exports = (router) => {
  router.get('/transactions', (req, res) => {
    const {accountId} = req.query
    TransactionsRepo.getGroupedTransactions(accountId)
      .then((transactions) => res.json(transactions))
      .catch(() => {
        res.status(500)
          .json({
            msg: 'Transactions could not be loaded for an unknown reason.'
          })
      })
  })
}
