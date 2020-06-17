const db = require('../models')

module.exports = {
  createAccount (name, type) {
    return db['Account'].create({name, type}).then(() => true)
  },
  async getAccounts () {
    const accounts = await db['Account'].findAll()
    return (await accounts).map((account) => ({
      name: account.name,
      type: account.type,
      balance: 0
    }))
  }
}
