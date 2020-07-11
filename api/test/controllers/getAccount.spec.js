const app = require('../../app')
const AccountsRepository = require('../../repositories/accounts')
const BalancesService = require('../../services/balances')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../services/balances')

chai.use(chaiHttp)

describe('Get Account Controller', () => {
  it('retrieves account data', () => {
    const account = {
      name: 'Sample Account',
      type: 'asset'
    }

    AccountsRepository.getAccount.mockResolvedValueOnce(account)
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    expect.assertions(1)

    return chai.request(app)
      .get('/accounts/123')
      .then(() => {
        expect(AccountsRepository.getAccount).toBeCalledWith(123)
      })
  })

  it('fetches the balance for the account', () => {
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    const account = {
      id: 123512,
      name: 'Sample Account',
      type: 'asset'
    }

    AccountsRepository.getAccount.mockResolvedValueOnce(account)
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    expect.assertions(1)

    return chai.request(app)
      .get('/accounts/123')
      .then(() => {
        expect(BalancesService.calculateBalanceForAccount).toBeCalledWith(account)
      })
  })

  it('responds with the account', () => {
    const account = {
      name: 'Sample Account',
      type: 'asset'
    }

    AccountsRepository.getAccount.mockResolvedValueOnce(account)
    BalancesService.calculateBalanceForAccount.mockResolvedValueOnce(10)

    expect.assertions(2)

    return chai.request(app)
      .get('/accounts/123')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
          ...account,
          balance: 10
        })
      })
  })

  it('fails to retrieve all of the accounts', () => {
    AccountsRepository.getAccount.mockRejectedValueOnce()

    expect.assertions(2)

    return chai.request(app)
      .get('/accounts/123')
      .then((res) => {
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({
          msg: 'Could not retrieve account for an unknown reason.'
        })
      })
  })
})
