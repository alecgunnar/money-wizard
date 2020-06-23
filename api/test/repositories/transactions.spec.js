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
      'sample',
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
      'sample',
      'some notes'
    )

    return expect(transactionsRepo.getTransaction(transactionId)).resolves.toEqual({
      id: transactionId,
      accountId: accountId,
      type: 'debit',
      amount: 10.57,
      date: '2020-06-18',
      reason: 'sample',
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
      'sample',
      'some notes'
    )

    return expect(transactionsRepo.getTransactions()).resolves.toEqual([
      {
        id: transactionId,
        accountId: accountId,
        type: 'debit',
        amount: 10.57,
        date: '2020-06-18',
        reason: 'sample',
        notes: 'some notes'
      }
    ])
  })

  it('gets all transactions and groups them', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    const firstTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-17',
      'sample',
      ''
    )

    const secondTransactionid = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      44.02,
      '2020-06-18',
      'sample',
      ''
    )

    return expect(transactionsRepo.getGroupedTransactions()).resolves.toEqual({
      '2020-06-17': [
        {
          id: firstTransactionId,
          accountId: accountId,
          type: 'debit',
          amount: 10.57,
          date: '2020-06-17',
          reason: 'sample',
          notes: ''
        }
      ],
      '2020-06-18': [
        {
          id: secondTransactionid,
          accountId: accountId,
          type: 'debit',
          amount: 44.02,
          date: '2020-06-18',
          reason: 'sample',
          notes: ''
        }
      ]
    })
  })

  it('gets all transactions and groups them in order', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-17',
      'sample',
      ''
    )

    await transactionsRepo.createTransaction(
      accountId,
      'debit',
      44.02,
      '2020-06-18',
      'sample',
      ''
    )

    const transactions = await transactionsRepo.getGroupedTransactions()
    const dates = Object.keys(transactions)

    expect(dates[0]).toBe('2020-06-18')
    expect(dates[1]).toBe('2020-06-17')
  })

  it('gets the transactions for an account', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    const firstTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'sample',
      ''
    )

    const secondTransactionid = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      44.02,
      '2020-06-18',
      'sample',
      ''
    )

    return expect(transactionsRepo.getTransactionsForAccount(accountId)).resolves.toEqual([
      {
        id: firstTransactionId,
        accountId: accountId,
        type: 'debit',
        amount: 10.57,
        date: '2020-06-18',
        reason: 'sample',
        notes: ''
      },
      {
        id: secondTransactionid,
        accountId: accountId,
        type: 'debit',
        amount: 44.02,
        date: '2020-06-18',
        reason: 'sample',
        notes: ''
      }
    ])
  })
})
