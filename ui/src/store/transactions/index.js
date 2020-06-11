import axios from 'axios'

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
    loadTransactions ({commit}) {
      return axios.get('/transactions')
        .then(resp => resp.data)
        .then(transactions => commit('transactionsLoaded', transactions))
        .catch(_ => commit('encounteredServerError', 'Could not load transactions.'))
    }
  }
}