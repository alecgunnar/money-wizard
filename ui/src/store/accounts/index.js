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
    loadAccounts () {
      
    }
  }
}