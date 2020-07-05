const app = require('../../app')
const TransactionsRepo = require('../../repositories/transactions')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../repositories/transactions')

chai.use(chaiHttp)

describe('Delete Transaction Controller', () => {
  it('removes the transaction', () => {
    expect.assertions(2)

    return chai.request(app)
      .delete('/transactions/1234')
      .then((res) => {
        expect(TransactionsRepo.deleteTransaction).toBeCalledWith('1234')
        expect(res.status).toBe(204)
      })
  })
})
