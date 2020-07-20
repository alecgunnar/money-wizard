const db = require('../models')

const fromAccountModel = (accountModel) => (accountModel ? {
  name: accountModel.name,
  type: accountModel.type
} : null)

const fromModel = (transactionModel) => ({
  id: transactionModel.id,
  accountId: transactionModel.AccountId,
  type: transactionModel.type,
  amount: transactionModel.amount,
  date: transactionModel.date,
  reason: transactionModel.reason,
  notes: transactionModel.notes,
  account: fromAccountModel(transactionModel.Account),
  reconciled: !!transactionModel.ReconciliationId
})

module.exports = {
  createTransaction (account, type, amount, date, reason, notes) {
    return db['Transaction'].create({
      AccountId: account,
      type,
      amount,
      date,
      reason,
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
  getGroupedTransactions (AccountId=null) {
    const query = {
      order: [
        ['date', 'DESC'],
        ['id', 'DESC']
      ],
      include: [db['Account']]
    }

    if (AccountId) {
      query.where = {
        AccountId
      }
    }

    return db['Transaction'].findAll(query).then((transactions) => transactions.reduce((acc, transaction) => {
      if (typeof acc[transaction.date] === 'undefined') acc[transaction.date] = []
      acc[transaction.date].push(fromModel(transaction))
      return acc
    }, {}))
  },
  getTransactionsForAccount (AccountId) {
    return db['Transaction'].findAll({
      include: [db['Account']],
      order: [
        ['date', 'DESC'],
        ['id', 'DESC']
      ],
      where: {
        AccountId,
        ReconciliationId: null
      }
    }).then((transactions) => transactions.map(fromModel))
  },
  deleteTransaction (id) {
    return db['Transaction'].findByPk(id)
      .then((transaction) => {
        if (transaction) transaction.destroy()
      })
  },
  updateReconciliation (id, ReconciliationId) {
    return db['Transaction'].update(
      {ReconciliationId},
      {
        where: {id}
      }
    )
  }
}
