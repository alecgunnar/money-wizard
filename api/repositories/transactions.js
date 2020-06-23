const db = require('../models')

const fromModel = (accountModel) => ({
  id: accountModel.id,
  accountId: accountModel.AccountId,
  type: accountModel.type,
  amount: accountModel.amount,
  date: accountModel.date,
  notes: accountModel.notes
})

module.exports = {
  createTransaction (account, type, amount, date, notes) {
    return db['Transaction'].create({
      AccountId: account,
      type,
      amount,
      date,
      notes
    }).then((transaction) => transaction.id)
  },
  getTransaction (id) {
    return db['Transaction'].findByPk(id)
      .then(fromModel)
  },
  getTransactions () {
    return db['Transaction'].findAll()
      .then((transactions) => transactions.map(fromModel))
  },
  getGroupedTransactions () {
    return db['Transaction'].findAll()
      .then((transactions) => transactions.reduce((acc, transaction) => {
        if (typeof acc[transaction.date] === 'undefined') acc[transaction.date] = []
        acc[transaction.date].push(fromModel(transaction))
        return acc
      }, {}))
  },
  getTransactionsForAccount (AccountId) {
    return db['Transaction'].findAll({
      where: {
        AccountId
      }
    }).then((transactions) => transactions.map(fromModel))
  }
}
