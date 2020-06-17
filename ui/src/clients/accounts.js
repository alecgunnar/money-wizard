import RootClient from './'

export default {
  async createAccount (name, type) {
    return RootClient.post('/accounts', {
      name,
      type
    }).then(_ => 'Success.')
  },
  async getAccounts () {
    
  }
}
