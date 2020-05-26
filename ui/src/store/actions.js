import accountsClient from '../clients/accounts'

export default {
  loadAccounts ({commit}) {
    accountsClient.getAccounts()
      .then((accounts) => commit('addAccounts', accounts))
      .catch(() => commit('serverError', 'LOAD_ACCOUNTS'))
  }
}
