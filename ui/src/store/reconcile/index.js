import RootClient from '@/clients'

const state = {
  account: null,
  balance: null,
  transactions: null
}

const getters = {
  reconciledBalance (state) {
    if (!state.transactions) return 0
    return state.account.reconciledBalance + +state.transactions
      .filter(transaction => transaction.posted)
      .map(transaction => {
        const {type, amount, account} = transaction

        if (account.type === 'asset') {
          return type === 'debit' ? -1 * amount : amount
        }

        return type === 'credit' ? -1 * amount : amount
      })
      .reduce((acc, amount) => acc + amount, 0).toFixed(2)
  }
}

const mutations = {
  accountLoaded (state, account) {
    state.account = account
    state.balance = account.balance
  },
  transactionsLoaded (state, transactions) {
    state.transactions = transactions.map(transaction => ({
      ...transaction,
      posted: true
    }))
  },
  reset (state) {
    state.account = null
    state.balance = null
    state.transactions = null
  },
  togglePosted (state, id) {
    const transaction = state.transactions.find(transaction => transaction.id === id)
    transaction.posted = !transaction.posted
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
    return RootClient.get(`/transactions?accountId=${id}&reconciled=false&inline=true`)
      .then(resp => resp.data)
      .then(data => commit('transactionsLoaded', data))
      .catch(() => null)
  },
  togglePosted ({commit}, id) {
    commit('togglePosted', id)
  },
  completeReconciliation ({state, getters}) {
    return RootClient.post(`/accounts/${state.account.id}/reconcile`, {
      balance: getters.reconciledBalance,
      transactions: state.transactions.filter(transaction => transaction.posted).map(transaction => transaction.id)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
