const transactionsRepository = require('../repositories/transactions')
const moment = require('moment')

module.exports = {
  async getTransactionsForAccount (id, inline=false) {
    const transactions = await transactionsRepository.getTransactionsForAccount(id)

    if (inline) return transactions

    const groupedTransactions = transactions.reduce((acc, transaction) => {
      if (!acc.hasOwnProperty(transaction.date)) acc[transaction.date] = []
      acc[transaction.date].push(transaction)
      return acc
    }, {})

    return Object.keys(groupedTransactions)
      .sort((a, b) => {
        return moment(b).isBefore(a)
      })
      .reduce((acc, date) => {
        acc[date] = groupedTransactions[date]
        return acc
      }, {})
  }
}
