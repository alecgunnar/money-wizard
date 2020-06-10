import moment from 'moment'

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
      commit('transactionsLoaded', [
        {
          id: '535a274e-d874-421b-8202-1ec49cf0ce38',
          date: moment().toISOString(),
          amount: 10.00,
          type: 'debit'
        },
        {
          id: '912470fa-7d93-49e1-a3b2-81a2dfcfe982',
          date: moment().toISOString(),
          amount: 44.12,
          type: 'credit'
        }
      ])
    }
  }
}