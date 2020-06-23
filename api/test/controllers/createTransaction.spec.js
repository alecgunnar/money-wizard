const app = require('../../app')
const AccountsRepository = require('../../repositories/accounts')
const TransactionsRepository = require('../../repositories/transactions')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../repositories/transactions')

chai.use(chaiHttp)

describe('Transactions Controller', () => {
  it('looks up account before adding transaction', () => {
    expect.assertions(1)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    TransactionsRepository.createTransaction.mockResolvedValueOnce()

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10',
        date: '05/28/1994',
        reason: 'sample',
        notes: ''
      })
      .then(() => {
        expect(AccountsRepository.getAccount).toBeCalledWith(456)
      })
  })

  it('fails to add transaction if the account does not exist', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce(null)

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10',
        date: '05/28/1994',
        reason: 'sample',
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
        reason: 'sample',
        notes: ''
      })
      .then(() => {
        expect(AccountsRepository.getAccount).not.toBeCalled()
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
        reason: 'sample',
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

    AccountsRepository.getAccount.mockResolvedValueOnce({
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
        reason: 'sample',
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

    AccountsRepository.getAccount.mockResolvedValueOnce({
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
        reason: 'sample',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'An amount is required.'
        })
      })
  })

  it('fails to add transaction if the amount is zero', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '0',
        date: '05/28/1994',
        reason: 'sample',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'An amount which is greater than zero is required.'
        })
      })
  })

  it('fails to add transaction if the amount is less than zero', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '-10',
        date: '05/28/1994',
        reason: 'sample',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'An amount which is greater than zero is required.'
        })
      })
  })

  it('fails to add transaction if the date is not present', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
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
        reason: 'sample',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'A date is required.'
        })
      })
  })

  it('fails to add transaction if the date is not formatted correctly', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
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
        date: 'invalid format',
        reason: 'sample',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'A properly formatted date date is required. Try a format like: MM/DD/YYYY'
        })
      })
  })

  it('fails to add transaction if the reason is not present', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
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
        date: '2020-07-06',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'A reason is required.'
        })
      })
  })

  it('fails to add transaction if the reason is empty', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
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
        date: '2020-07-06',
        reason: '',
        notes: ''
      })
      .then((res) => {
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
          msg: 'A non-empty reason is required.'
        })
      })
  })

  it('saves the transaction when the input is valid', () => {
    expect.assertions(1)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    TransactionsRepository.createTransaction.mockResolvedValueOnce()

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10.57',
        date: '05/28/1994',
        reason: 'sample',
        notes: 'these are some notes'
      })
      .then(() => {
        expect(TransactionsRepository.createTransaction).toBeCalledWith(
          456,
          'debit',
          10.57,
          '1994-05-28',
          'sample',
          'these are some notes'
        )
      })
  })

  it('saves the transaction when the notes are left out', () => {
    expect.assertions(1)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    TransactionsRepository.createTransaction.mockResolvedValueOnce()

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10.57',
        date: '05/28/1994',
        reason: 'sample',
      })
      .then(() => {
        expect(TransactionsRepository.createTransaction).toBeCalledWith(
          456,
          'debit',
          10.57,
          '1994-05-28',
          'sample',
          ''
        )
      })
  })

  it('when the transaction is successfully saved the request is resolved', () => {
    expect.assertions(1)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    TransactionsRepository.createTransaction.mockResolvedValueOnce()

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10.57',
        date: '05/28/1994',
        reason: 'sample',
        notes: 'these are some notes'
      })
      .then((res) => {
        expect(res.status).toBe(201)
      })
  })

  it('when the transaction fails to be saved the request is rejected', () => {
    expect.assertions(2)

    AccountsRepository.getAccount.mockResolvedValueOnce({
      id: 456,
      name: 'Sample'
    })

    TransactionsRepository.createTransaction.mockRejectedValueOnce()

    return chai.request(app)
      .post('/transactions')
      .set('content-type', 'application/json')
      .send({
        account: 456,
        type: 'debit',
        amount: '10.57',
        date: '05/28/1994',
        reason: 'sample',
        notes: 'these are some notes'
      })
      .then((res) => {
        expect(res.status).toBe(500)
        expect(res.body).toEqual({
          msg: 'Transaction creation failed for an unknown reason.'
        })
      })
  })
})
