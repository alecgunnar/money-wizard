export default {
  state: {
    transactions: []
  },
  mutations: {
    transactionsLoaded (state, transactions) {
      state.transactions = transactions
    },
    clearTransactions (state) {
      state.transactions = []
    }
  },
  getters: {},
  actions: {
    loadTransactions () {
      
    }
  }
}