const app = require('../../app')
const TransactionsService = require('../../services/transactions')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../services/transactions')

chai.use(chaiHttp)

describe('Transactions Controller', () => {
  it('rejects when the account id is left out', () => {
    expect.assertions(1)

    const request = chai.request(app).get('/transactions')

    return expect(request).resolves.toMatchObject({
      status: 400,
      body: {
        msg: 'An account id must be provided using the `accountId` query parameter.'
      }
    })
  })

  it('gets all transactions for an account', () => {
    expect.assertions(1)

    TransactionsService.getTransactionsForAccount.mockResolvedValueOnce({})

    return chai.request(app)
      .get('/transactions?accountId=123')
      .then(() => {
        expect(TransactionsService.getTransactionsForAccount).toBeCalledWith('123', false)
      })
  })

  it('gets all transactions for an account inline', () => {
    expect.assertions(1)

    TransactionsService.getTransactionsForAccount.mockResolvedValueOnce({})

    return chai.request(app)
      .get('/transactions?accountId=123&inline=true')
      .then(() => {
        expect(TransactionsService.getTransactionsForAccount).toBeCalledWith('123', true)
      })
  })

  it('resolves when all transactions are loaded', () => {
    expect.assertions(1)

    TransactionsService.getTransactionsForAccount.mockResolvedValueOnce({
      '2020-07-06': [
        {
          id: 13,
          amount: 23.12
        }
      ]
    })

    const request = chai.request(app)
      .get('/transactions?accountId=456')

    return expect(request).resolves.toMatchObject({
      body: {
        '2020-07-06': [
          {
            id: 13,
            amount: 23.12
          }
        ]
      }
    })
  })

  it('rejects when transactions cannot be loaded', () => {
    expect.assertions(1)

    TransactionsService.getTransactionsForAccount.mockRejectedValueOnce()

    const request = chai.request(app).get('/transactions?accountId=123')

    return expect(request).resolves.toMatchObject({
      status: 500,
      body: {
        msg: 'Transactions could not be loaded for an unknown reason.'
      }
    })
  })
})
