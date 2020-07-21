const db = require('../../models')
const accountsRepo = require('../../repositories/accounts')
const transactionsRepo = require('../../repositories/transactions')
const reconciliationsRepo = require('../../repositories/reconciliations')

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
      notes: 'some notes',
      reconciled: false
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

  it('gets all transactions for an account that are not reconciled', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')

    const reconciliationId = await reconciliationsRepo.createReconciliation(accountId, 10.99, '2020-02-13')

    const firstTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'sample',
      'some notes'
    )

    await transactionsRepo.updateReconciliation(firstTransactionId, reconciliationId)

    const secondTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'credit',
      11.11,
      '2020-06-18',
      'sample',
      ''
    )

    return expect(
      transactionsRepo.getTransactionsForAccount(accountId)
    ).resolves.toMatchObject([
      {
        id: secondTransactionId
      }
    ])
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

    const results = transactionsRepo.getTransactionsForAccount(accountId)

    return expect(results).resolves.toMatchObject([
      {
        id: secondTransactionid,
        accountId,
        account: {
          type: 'asset'
        },
        type: 'debit',
        amount: 44.02,
        date: '2020-06-18',
        reason: 'sample',
        notes: ''
      },
      {
        id: firstTransactionId,
        accountId,
        account: {
          type: 'asset'
        },
        type: 'debit',
        amount: 10.57,
        date: '2020-06-18',
        reason: 'sample',
        notes: ''
      }
    ])
  })

  it('gets the transactions for an account in order by date, then id', async () => {
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
      '2020-06-19',
      'sample',
      ''
    )

    const thirdTransactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      44.02,
      '2020-06-18',
      'sample',
      ''
    )

    const results = await transactionsRepo.getTransactionsForAccount(accountId)

    expect(results[0].id).toBe(secondTransactionid)
    expect(results[1].id).toBe(thirdTransactionId)
    expect(results[2].id).toBe(firstTransactionId)
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

  it('updates the reconciliation', async () => {
    const accountId = await accountsRepo.createAccount('Sample', 'asset')

    const transactionId = await transactionsRepo.createTransaction(
      accountId,
      'debit',
      10.57,
      '2020-06-18',
      'sample',
      'some notes'
    )

    const reconciliationId = await reconciliationsRepo.createReconciliation(accountId, 10.11, '2020-05-28')

    return expect(
      transactionsRepo.updateReconciliation(transactionId, reconciliationId)
        .then(() => transactionsRepo.getTransaction(transactionId))
    ).resolves.toMatchObject({
      id: transactionId,
      reconciled: true
    })
  })
})
