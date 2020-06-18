const db = require('../../models')
const accounts = require('../../repositories/accounts')

describe('Accounts repository', () => {
  beforeEach(() => {
    db.sequelize.query('DELETE FROM Accounts')
  })

  it('creates an account', () => {
    expect.assertions(1)
    
    return accounts.createAccount('Sample Account', 'asset')
      .then((id) => {
        expect(typeof id === 'number').toBeTruthy()
      })
  })

  it('gets an account', async () => {
    const id = await accounts.createAccount('Sample Account', 'asset')
    return expect(accounts.getAccount(id)).resolves.toEqual({
      id,
      name: 'Sample Account',
      type: 'asset'
    })
  })

  it('returns null when the account does not exist', () => {
    expect(accounts.getAccount(12452)).resolves.toBeNull()
  })

  it('gets all accounts', async () => {
    const id = await accounts.createAccount('Sample Account', 'asset')
    return expect(accounts.getAccounts()).resolves.toEqual([{
      id,
      name: 'Sample Account',
      type: 'asset'
    }])
  })
})
