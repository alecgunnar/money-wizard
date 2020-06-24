import RootClient from './'

export default {
  addTransaction (account, type, amount, date, reason, notes) {
    return RootClient.post('/transactions', {
      account, type, amount, date, reason, notes
    }).then(() => 'Created')
  },
  getTransactions(accountId) {
    const endpoint = `/transactions${accountId ? `?accountId=${accountId}` : ''}`
    return RootClient.get(endpoint)
      .then((resp) => resp.data)
  }
}