const TransactionsRepository = require('../repositories/transactions')

module.exports = {
  calculateBalanceForAccount (accountId) {
    return TransactionsRepository.getBalanceForAccount(accountId)
      .catch(() => null)
  }
}
