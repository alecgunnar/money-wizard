import RootClient from '@/clients'

export default {
  state: {
    accountId: null,
    account: null,
    transactions: []
  },
  mutations: {
    setAccountId (state, id) {
      state.accountId = id
    },
    accountLoaded (state, account) {
      state.account = account
    },
    transactionsLoaded (state, transactions) {
      state.transactions = transactions
    }
  },
  getters: {},
  actions: {
    async forAccount ({commit, dispatch}, accountId) {
      commit('setAccountId', accountId)
      try {
        await dispatch('loadAccount')
        await dispatch('loadTransactions')
      } catch (err) {
        commit('encounteredServerError')
        return false
      }

      return true
    },
    loadAccount ({state, commit}) {
      return RootClient.get(`/accounts/${state.accountId}`)
        .then(resp => resp.data)
        .then(data => commit('accountLoaded', data))
    },
    loadTransactions ({state, commit}) {
      return RootClient.get(`/transactions?accountId=${state.accountId}`)
        .then(resp => resp.data)
        .then(data => commit('transactionsLoaded', data))
    }
  }
}
