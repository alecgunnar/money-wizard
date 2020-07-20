const app = require('../../app')
const AccountsRepository = require('../../repositories/accounts')
const TransactionsRepository = require('../../repositories/transactions')
const ReconciliationService = require('../../services/reconciliation')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')
jest.mock('../../repositories/transactions')
jest.mock('../../services/reconciliation')

chai.use(chaiHttp)

describe('Reconcile Account Controller', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('loads the account data', async () => {
    AccountsRepository.getAccount.mockResolvedValueOnce({
      name: 'sample'
    })

    ReconciliationService.reconcileAccount.mockResolvedValueOnce()

    expect.assertions(1)

    return chai.request(app)
      .post('/accounts/123/reconcile')
      .set('content-type', 'application/json')
      .send({
        balance: 10,
        transactions: [2]
      })
      .then(() => {
        expect(AccountsRepository.getAccount).toBeCalledWith('123')
      })
  })

  it('responds with not found if the account does not exist', () => {
    AccountsRepository.getAccount.mockResolvedValueOnce(null)

    expect.assertions(1)

    return expect(
      chai.request(app)
        .post('/accounts/123/reconcile')
        .send({
          balance: 10,
          transactions: [2]
        })
    ).resolves.toMatchObject({
      status: 404,
      body: {
        msg: 'The account does not exist.'
      }
    })
  })

  it('responds with bad request if transactions are not provided', () => {
    expect.assertions(1)

    return expect(
      chai.request(app)
        .post('/accounts/123/reconcile')
        .send({
          balance: 242.13
        })
    ).resolves.toMatchObject({
      status: 400,
      body: {
        msg: 'A list of transactions must be provided.'
      }
    })
  })

  it('responds with bad request if a list of transactions is not provided', () => {
    expect.assertions(1)

    return expect(
      chai.request(app)
        .post('/accounts/123/reconcile')
        .send({
          balance: 242.13,
          transactions: '123'
        })
    ).resolves.toMatchObject({
      status: 400,
      body: {
        msg: 'The field transactions must be a list of transaction id\'s.'
      }
    })
  })

  it('loads each transaction', () => {
    AccountsRepository.getAccount.mockResolvedValueOnce({
      name: 'sample'
    })

    TransactionsRepository.getTransaction.mockResolvedValue({
      amount: 10
    })

    ReconciliationService.reconcileAccount.mockResolvedValueOnce()

    expect.assertions(2)

    return chai.request(app)
      .post('/accounts/123/reconcile')
      .send({
        balance: 10,
        transactions: [23, 45]
      })
      .then(() => {
        expect(TransactionsRepository.getTransaction).toBeCalledWith(23)
        expect(TransactionsRepository.getTransaction).toBeCalledWith(45)
      })
  })

  it('responds with 400 when a transaction id is not valid', () => {
    AccountsRepository.getAccount.mockResolvedValueOnce({
      name: 'sample'
    })

    TransactionsRepository.getTransaction.mockResolvedValue(null)

    expect.assertions(1)

    return expect(
      chai.request(app)
        .post('/accounts/123/reconcile')
        .send({
          balance: 10,
          transactions: [23]
        })
    ).resolves.toMatchObject({
      status: 400,
      body: {
        msg: 'One or more transaction id\'s are not valid.'
      }
    })
  })

  it('reconciles account with transactions', () => {
    const account = {
      name: 'sample'
    }

    AccountsRepository.getAccount.mockResolvedValueOnce(account)

    const transaction = {
      amount: 3.11
    }

    TransactionsRepository.getTransaction.mockResolvedValue(transaction)

    ReconciliationService.reconcileAccount.mockResolvedValueOnce()

    expect.assertions(1)

    return chai.request(app)
      .post('/accounts/123/reconcile')
      .send({
        transactions: [23]
      })
      .then(() => {
        expect(ReconciliationService.reconcileAccount).toBeCalledWith(account, [transaction])
      })
  })

  it('responds with created when the account has been reconciled', () => {
    AccountsRepository.getAccount.mockResolvedValueOnce({
      name: 'sample'
    })

    TransactionsRepository.getTransaction.mockResolvedValue({
      amount: 3.11
    })

    ReconciliationService.reconcileAccount.mockResolvedValueOnce()

    expect.assertions(1)

    return expect(
      chai.request(app)
        .post('/accounts/123/reconcile')
        .send({
          balance: 10,
          transactions: [23]
        })
    ).resolves.toMatchObject({
      status: 201
    })
  })

  it('responds with server error when the account cannot be reconciled', () => {
    AccountsRepository.getAccount.mockResolvedValueOnce({
      name: 'sample'
    })

    TransactionsRepository.getTransaction.mockResolvedValue({
      amount: 3.11
    })

    ReconciliationService.reconcileAccount.mockRejectedValueOnce()

    expect.assertions(1)

    return expect(
      chai.request(app)
        .post('/accounts/123/reconcile')
        .send({
          balance: 10,
          transactions: [23]
        })
    ).resolves.toMatchObject({
      status: 500
    })
  })
})
