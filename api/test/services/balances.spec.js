const BalancesService = require('../../services/balances')
const TransactionsRepository = require('../../repositories/transactions')
const ReconciliationsRepository = require('../../repositories/reconciliations')

jest.mock('../../repositories/transactions')
jest.mock('../../repositories/reconciliations')

const transactions = [
  {
    type: 'debit',
    amount: 5
  },
  {
    type: 'credit',
    amount: 7
  }
]

describe('Balances Service', () => {
  it('loads the latest reconciliation', () => {
    ReconciliationsRepository.getLatestReconciliationForAccount.mockResolvedValueOnce(null)
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce([])
    BalancesService.calculateBalanceForAccount({
      id: 1241,
      type: 'asset'
    })
    expect(ReconciliationsRepository.getLatestReconciliationForAccount).toBeCalledWith(1241)
  })

  it('loads the transactions for account', async () => {
    ReconciliationsRepository.getLatestReconciliationForAccount.mockResolvedValueOnce(null)
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce([])
    await BalancesService.calculateBalanceForAccount({
      id: 1241,
      type: 'asset'
    })
    expect(TransactionsRepository.getTransactionsForAccount).toBeCalledWith(1241)
  })

  it('resolves with the balance for an asset account', () => {
    const account = {
      id: 1241,
      type: 'asset'
    }
    ReconciliationsRepository.getLatestReconciliationForAccount.mockResolvedValueOnce(null)
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    return expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(2)
  })

  it('resolves with the balance for a credit account', () => {
    const account = {
      id: 1241,
      type: 'credit'
    }
    ReconciliationsRepository.getLatestReconciliationForAccount.mockResolvedValueOnce(null)
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    return expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(-2)
  })

  it('resolves with the balance for a loan account', () => {
    const account = {
      id: 1241,
      type: 'loan'
    }
    ReconciliationsRepository.getLatestReconciliationForAccount.mockResolvedValueOnce(null)
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    return expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(-2)
  })

  it('resolves with the sum of the latest reconciliation and the transactions', () => {
    const account = {
      id: 1241,
      type: 'loan'
    }
    ReconciliationsRepository.getLatestReconciliationForAccount.mockResolvedValueOnce({
      balance: 10.00
    })
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    return expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(8)
  })

  it('resolves when the respository fails', () => {
    const account = {
      id: 1241,
      type: 'asset'
    }
    TransactionsRepository.getTransactionsForAccount.mockRejectedValueOnce()
    return expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBeNull()
  })
})
