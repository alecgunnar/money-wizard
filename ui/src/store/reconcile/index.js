import RootClient from '@/clients'

const state = {
  account: null,
  balance: null,
  transactions: null
}

const mutations = {
  accountLoaded (state, account) {
    state.account = account
    state.balance = account.balance
  },
  transactionsLoaded (state, transactions) {
    state.transactions = transactions
  },
  reset (state) {
    state.account = null
    state.balance = null
    state.transactions = null
  }
}

const actions = {
  reconcileAccount ({commit, dispatch}, id) {
    return RootClient.get(`/accounts/${id}`)
      .then(resp => resp.data)
      .then(data => commit('accountLoaded', data))
      .then(() => dispatch('loadTransactions', id))
      .then(() => true)
      .catch(() => {
        commit('encounteredServerError', null, {root: true})
        return false
      })
  },
  loadTransactions ({commit}, id) {
    return RootClient.get(`/transactions?accountId=${id}&reconciled=false`)
      .then(resp => resp.data)
      .then(data => commit('transactionsLoaded', data))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
