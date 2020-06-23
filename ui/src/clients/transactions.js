import RootClient from './'

export default {
  addTransaction (account, type, amount, date, notes) {
    return RootClient.post('/transactions', {
      account, type, amount, date, notes
    }).then(() => 'Created')
  },
  getTransactions() {
    return RootClient.get('/transactions')
      .then((resp) => resp.data)
  }
}