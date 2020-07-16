const TransactionsService = require('../services/transactions')

module.exports = (router) => {
  router.get('/transactions', (req, res) => {
    const {accountId, inline} = req.query

    if (!accountId) {
      return res.status(400)
        .json({
          msg: 'An account id must be provided using the `accountId` query parameter.'
        })
    }

    TransactionsService.getTransactionsForAccount(accountId, inline ? true : false)
      .then((transactions) => res.json(transactions))
      .catch(() => {
        res.status(500)
          .json({
            msg: 'Transactions could not be loaded for an unknown reason.'
          })
      })
  })
}
