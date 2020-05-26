export default {
  addAccounts (state, accounts) {
    state.accounts = state.accounts.concat(accounts)
  },

  serverError (state, msg) {
    state.serverErrors.push(msg)
  }
}
