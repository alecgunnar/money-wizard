const TransactionsRepository = require('../repositories/transactions')
const ReconciliationsRepository = require('../repositories/reconciliations')

const assetBalance = (transactions) => transactions.reduce((acc, {type, amount}) => type === 'debit' ? acc - amount : acc + amount, 0)
const creditBalance = (transactions) => transactions.reduce((acc, {type, amount}) => type === 'debit' ? acc + amount : acc - amount, 0)

module.exports = {
  async calculateBalanceForAccount ({id, type}) {
    try {
      const latestReconciliation = await ReconciliationsRepository.getLatestReconciliationForAccount(id)
      const reconciledBalance = latestReconciliation !== null ? latestReconciliation.balance : 0
      const transactions = await TransactionsRepository.getTransactionsForAccount(id)
      return reconciledBalance + (type === 'asset' ? assetBalance(transactions) : creditBalance(transactions))
    } catch (e) {
      return null
    }
  },
  async getReconciledBalance ({id}) {
    const latestReconciliation = await ReconciliationsRepository.getLatestReconciliationForAccount(id)
    return !!latestReconciliation ? latestReconciliation.balance : 0
  }
}
