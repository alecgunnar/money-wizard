const app = require('../../app')
const TransactionsRepo = require('../../repositories/transactions')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../repositories/transactions')

chai.use(chaiHttp)

describe('Transactions Controller', () => {
  it('gets all transactions', () => {
    expect.assertions(1)

    TransactionsRepo.getTransactions.mockResolvedValueOnce([])

    return chai.request(app)
    .get('/transactions')
    .then(() => {
      expect(TransactionsRepo.getTransactions).toBeCalled()
    })
  })

  it('resolves when all transactions are loaded', () => {
    expect.assertions(1)

    const transaction = {
      id: 13,
      amount: 23.12
    }

    TransactionsRepo.getTransactions.mockResolvedValueOnce([
      transaction
    ])

    return chai.request(app)
    .get('/transactions')
    .then((res) => {
      expect(res.body).toEqual([transaction])
    })
  })

  it('rejects when transactions cannot be loaded', () => {
    expect.assertions(2)

    TransactionsRepo.getTransactions.mockRejectedValueOnce()

    return chai.request(app)
    .get('/transactions')
    .then((res) => {
      expect(res.status).toBe(500)
      expect(res.body).toEqual({
        msg: 'Transactions could not be loaded for an unknown reason.'
      })
    })
  })
})
