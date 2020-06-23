const TransactionsRepository = require('../repositories/transactions')

const assetBalance = (transactions) => transactions.reduce((acc, {type, amount}) => type === 'debit' ? acc - amount : acc + amount, 0)
const creditBalance = (transactions) => transactions.reduce((acc, {type, amount}) => type === 'debit' ? acc + amount : acc - amount, 0)

module.exports = {
  calculateBalanceForAccount ({id, type}) {
    return TransactionsRepository.getTransactionsForAccount(id)
      .then((transactions) => type === 'asset' ? assetBalance(transactions) : creditBalance(transactions))
      .catch(() => null)
  }
}
