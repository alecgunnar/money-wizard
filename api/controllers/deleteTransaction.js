const TransactionsRepo = require('../repositories/transactions')

module.exports = (router) => {
  router.delete('/transactions/:id', (req, res) => {
    TransactionsRepo.deleteTransaction(req.params.id)
    res.sendStatus(204)
  })
}
