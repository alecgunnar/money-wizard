const app = require('../../app')
const accountsRepo = require('../../repositories/accounts')
const transactionsRepo = require('../../repositories/transactions')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../repositories/transactions')

chai.use(chaiHttp)

describe('Transactions Controller', () => {
  it('looks up account before adding transaction', () => {
    expect.assertions(1)

    accountsRepo.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10',
        date: '05/28/1994',
        notes: ''
      })
      .then(() => {
        expect(accountsRepo.getAccount).toBeCalledWith(456)
      })
  })

  it('fails to add transaction if the account does not exist', () => {
    expect.assertions(2)

    accountsRepo.getAccount.mockResolvedValueOnce(null)

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10',
        date: '05/28/1994',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'An account with the id provided does not exist.'
        })
      })
  })

  it('does not load account if the account is missing', () => {
    expect.assertions(1)

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        type: 'debit',
        amount: '10',
        date: '05/28/1994',
        notes: ''
      })
      .then(() => {
        expect(accountsRepo.getAccount).not.toBeCalled()
      })
  })

  it('fails to add transaction if the account is missing', () => {
    expect.assertions(2)

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        type: 'debit',
        amount: '10',
        date: '05/28/1994',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'An account is required.'
        })
      })
  })

  it('fails to add transaction if the type is missing', () => {
    expect.assertions(2)

    accountsRepo.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        amount: '10',
        date: '05/28/1994',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'A type is required.'
        })
      })
  })

  it('fails to add transaction if the amount is missing', () => {
    expect.assertions(2)

    accountsRepo.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        date: '05/28/1994',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'An amount is required.'
        })
      })
  })
})
