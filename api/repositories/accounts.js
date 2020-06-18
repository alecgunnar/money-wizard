
const db = require('../models')

const fromModel = (account) => account !== null ? ({
  id: account.id,
  name: account.name,
  type: account.type
}) : null

module.exports = {
  createAccount (name, type) {
    return db['Account'].create({name, type}).then((account) => account.id)
  },
  async getAccounts () {
    const accounts = await db['Account'].findAll()
    return (await accounts).map(fromModel)
  },
  async getAccount (id) {
    const account = await db['Account'].findByPk(id)
    return fromModel(account)
  }
}
