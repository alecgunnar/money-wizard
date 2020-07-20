const ReconciliationRepository = require('../repositories/reconciliations')
const TransactionsRepository = require('../repositories/transactions')
const BalancesService = require('./balances')
const moment = require('moment')

const assetBalance = (transactions) => transactions.reduce((acc, {type, amount}) => type === 'debit' ? acc - amount : acc + amount, 0)
const creditBalance = (transactions) => transactions.reduce((acc, {type, amount}) => type === 'debit' ? acc + amount : acc - amount, 0)

module.exports = {
  async reconcileAccount (account, transactions) {
    const todaysDate = moment().format('YYYY-MM-DD')
    const reconciledBalance = await BalancesService.getReconciledBalance(account)
    const balance = reconciledBalance + (account.type === 'asset' ? assetBalance(transactions) : creditBalance(transactions))
    const reconciliationId = await ReconciliationRepository.createReconciliation(account.id, balance, todaysDate)
    transactions.forEach(({id}) => {
      TransactionsRepository.updateReconciliation(id, reconciliationId)
    })
  }
}