import client from '@/clients'

export default {
  state: {
    accounts: []
  },
  mutations: {
    loadedAccounts (state, accounts) {
      state.accounts = accounts
    }
  },
  actions: {
    loadAccounts ({commit}) {
      return client.get('/accounts')
        .then(resp => resp.data)
        .then(accounts => commit('loadedAccounts', accounts))
        .catch(_ => commit('encounteredServerError', 'Could not load accounts.'))
    }
  }
}