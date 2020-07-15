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

    return expect(transactionsRepo.getTransaction(transactionId)).resolves.toMatchObject({
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

    return expect(transactionsRepo.getTransactions()).resolves.toMatchObject([
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

  it('gets all transactions for an account and groups them', async () => {
    const firstAccountId = await accountsRepo.createAccount('Sample', 'asset')
    const firstTransactionId = await transactionsRepo.createTransaction(
      firstAccountId,
      'debit',
      10.57,
      '2020-06-18',
      'sample',
      'some notes'
    )

    const secondAccountId = await accountsRepo.createAccount('Sample Two', 'credit')
    await transactionsRepo.createTransaction(
      secondAccountId,
      'credit',
      11.11,
      '2020-06-15',
      'sample',
      ''
    )

    return expect(transactionsRepo.getGroupedTransactions(firstAccountId)).resolves.toMatchObject({
      '2020-06-18': [
        {
          id: firstTransactionId,
          accountId: firstAccountId,
          type: 'debit',
          amount: 10.57,
          date: '2020-06-18',
          reason: 'sample',
          notes: 'some notes',
          account: {
            name: 'Sample',
            type: 'asset'
          }
        }
      ]
    })
  })

  it('gets all transactions for an account in order', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')
    const firstTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'sample',
      'some notes'
    )

    const secondTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'credit',
      11.11,
      '2020-06-18',
      'sample',
      ''
    )

    const transactions = await transactionsRepo.getGroupedTransactions(accountId)

    expect(transactions['2020-06-18'][0].id).toBe(secondTransactionId)
    expect(transactions['2020-06-18'][1].id).toBe(firstTransactionId)
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

    return expect(transactionsRepo.getGroupedTransactions()).resolves.toMatchObject({
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

    return expect(transactionsRepo.getTransactionsForAccount(accountId)).resolves.toMatchObject([
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

  it('deletes transaction', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')

    const id = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'sample',
      'some notes'
    )

    await transactionsRepo.deleteTransaction(id)

    expect(transactionsRepo.getTransactions()).resolves.toEqual([])
  })

  it('deletes transaction even if it does not exist', () => {
    expect(transactionsRepo.deleteTransaction('1234')).resolves.toBeUndefined()
  })
})
