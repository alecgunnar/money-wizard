import RootClient from './'

export default {
  async createAccount (name, type) {
    return RootClient.post('/accounts', {
      name,
      type
    }).then(_ => 'Success.')
  },
  async getAccounts () {
    return RootClient.get('/accounts')
      .then((resp) => resp.data)
  },
  getAccount (id) {
    return Promise.resolve()
  }
}
