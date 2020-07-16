const transactionsRepository = require('../repositories/transactions')

module.exports = {
  async getTransactionsForAccount (id, inline=false) {
    const transactions = await transactionsRepository.getTransactionsForAccount(id)

    if (inline) return transactions

    return transactions.reduce((acc, transaction) => {
      if (!acc.hasOwnProperty(transaction.date)) acc[transaction.date] = []
      acc[transaction.date].push(transaction)
      return acc
    }, {})
  }
}
