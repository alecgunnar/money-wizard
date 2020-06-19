const db = require('../../models')
const accountsRepo = require('../../repositories/accounts')
const transactionsRepo = require('../../repositories/transactions')

describe('Transactions Repository', () => {
  beforeEach(() => {
    db.sequelize.query('DELETE FROM Transactions')
    db.sequelize.query('DELETE FROM Accounts')
  })

  it('creates the transaction', async () => {
    expect.assertions(1)

    const accountId = await accountsRepo.createAccount('Sample', 'asset')

    return transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'some notes'
    ).then((id) => {
      expect(typeof id === 'number').toBeTruthy()
    })
  })

  it('gets a transaction', async () => {
    expect.assertions(1)

    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    const transactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'some notes'
    )

    return expect(transactionsRepo.getTransaction(transactionId)).resolves.toEqual({
      id: transactionId,
      accountId: accountId,
      type: 'debit',
      amount: 10.57,
      date: '2020-06-18',
      notes: 'some notes'
    })
  })

  it('gets all transactions', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    const transactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'some notes'
    )

    return expect(transactionsRepo.getTransactions()).resolves.toEqual([{
      id: transactionId,
      accountId: accountId,
      type: 'debit',
      amount: 10.57,
      date: '2020-06-18',
      notes: 'some notes'
    }])
  })

  it('gets the sum of all transactions for an account', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      ''
    )

    await transactionsRepo.createTransaction(
      accountId,
      'debit',
      44.02,
      '2020-06-18',
      ''
    )

    return expect(transactionsRepo.getBalanceForAccount(accountId)).resolves.toEqual(54.59)
  })
})
