const TransactionsRepo = require('../repositories/transactions')

module.exports = (router) => {
  router.get('/transactions', (_, res) => {
    TransactionsRepo.getTransactions()
      .then((transactions) => res.json(transactions))
      .catch(() => {
        res.status(500)
          .json({
            msg: 'Transactions could not be loaded for an unknown reason.'
          })
      })
  })
}
