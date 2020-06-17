const db = require('../../models')
const accounts = require('../../repositories/accounts')

describe('Accounts repository', () => {
  beforeEach(() => {
    db.sequelize.query('DELETE FROM Accounts')
  })

  it('creates an account', async () => {
    const id = await accounts.createAccount('Sample Account', 'asset')
    expect(typeof id === 'number').toBeTruthy()
  })

  it('gets an accounts', async () => {
    const id = await accounts.createAccount('Sample Account', 'asset')
    const account = await accounts.getAccount(id)
    expect(account).toEqual({
      name: 'Sample Account',
      type: 'asset',
      balance: 0
    })
  })

  it('gets all accounts', async () => {
    await accounts.createAccount('Sample Account', 'asset')
    const account = await accounts.getAccounts()
    expect(account).toEqual([{
      name: 'Sample Account',
      type: 'asset',
      balance: 0
    }])
  })
})
