const db = require('../models')

const fromModel = (model) => {
  if (!model) return null

  return {
    id: model.id,
    balance: model.balance,
    completed: model.completed
  }
}

module.exports = {
  createReconciliation (AccountId, balance, completed) {
    return db['Reconciliation'].create({
      AccountId,
      balance,
      completed
    }).then(result => result.id)
  },
  getReconciliation (ReconciliationId) {
    return db['Reconciliation']
      .findByPk(ReconciliationId)
      .then(result => fromModel(result))
  },
  getLatestReconciliationForAccount (AccountId) {
    return db['Reconciliation'].findAll({
      limit: 1,
      where: {
        AccountId
      },
      order: [
        ['completed', 'DESC']
      ]
    }).then(results => fromModel(results[0]))
  }
}