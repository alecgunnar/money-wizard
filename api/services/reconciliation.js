const ReconciliationRepository = require('../repositories/reconciliations')
const TransactionsRepository = require('../repositories/transactions')
const moment = require('moment')

module.exports = {
  async reconcileAccount (account, balance, transactions) {
    const todaysDate = moment().format('YYYY-MM-DD')
    const reconciliationId = await ReconciliationRepository.createReconciliation(account.id, balance, todaysDate)
    transactions.forEach(({id}) => {
      TransactionsRepository.updateReconciliation(id, reconciliationId)
    })
  }
}