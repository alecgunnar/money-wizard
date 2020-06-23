const app = require('../../app')
const AccountsRepository = require('../../repositories/accounts')
const BalancesService = require('../../services/balances')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../services/balances')

chai.use(chaiHttp)

describe('Get Accounts Controller', () => {
  it('retrieves all of the accounts', () => {
    const accounts = [
      {
        name: 'Sample Account',
        type: 'asset'
      }
    ]

    AccountsRepository.getAccounts.mockResolvedValueOnce(accounts)
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    expect.assertions(1)

    return chai.request(app)
      .get('/accounts')
      .then(() => {
        expect(AccountsRepository.getAccounts).toBeCalled()
      })
  })

  it('fetches the balance for each account', () => {
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    const accounts = [
      {
        id: 123512,
        name: 'Sample Account',
        type: 'asset'
      }
    ]

    AccountsRepository.getAccounts.mockResolvedValueOnce(accounts)
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    expect.assertions(1)

    return chai.request(app)
      .get('/accounts')
      .then(() => {
        expect(BalancesService.calculateBalanceForAccount).toBeCalledWith(accounts[0])
      })
  })

  it('responds with each account', () => {
    const accounts = [
      {
        name: 'Sample Account',
        type: 'asset'
      }
    ]

    AccountsRepository.getAccounts.mockResolvedValueOnce(accounts)
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    expect.assertions(2)

    return chai.request(app)
      .get('/accounts')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([{
          ...accounts[0],
          balance: 10
        }])
      })
  })

  it('fails to retrieve all of the accounts', () => {
    AccountsRepository.getAccounts.mockRejectedValueOnce()

    expect.assertions(3)

    return chai.request(app)
      .get('/accounts')
      .then((res) => {
        expect(AccountsRepository.getAccounts).toBeCalled()
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({
          msg: 'Could not retrieve all accounts for an unknown reason.'
        })
      })
  })
})
