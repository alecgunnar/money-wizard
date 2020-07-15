import RootClient from '@/clients'

const state = {
  account: null,
  transactions: null
}

const mutations = {
  accountLoaded (state, account) {
    state.account = account
  },
  transactionsLoaded (state, transactions) {
    state.transactions = transactions
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
