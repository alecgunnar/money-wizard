const BalancesService = require('../../services/balances')
const TransactionsRepository = require('../../repositories/transactions')

jest.mock('../../repositories/transactions')

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
  it('loads the transactions for account', () => {
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce()
    BalancesService.calculateBalanceForAccount({
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
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(2)
  })

  it('resolves with the balance for a credit account', () => {
    const account = {
      id: 1241,
      type: 'credit'
    }
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(-2)
  })

  it('resolves with the balance for a loan account', () => {
    const account = {
      id: 1241,
      type: 'loan'
    }
    TransactionsRepository.getTransactionsForAccount.mockResolvedValueOnce(transactions)
    expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBe(-2)
  })

  it('resolves when the respository fails', () => {
    const account = {
      id: 1241,
      type: 'asset'
    }
    TransactionsRepository.getTransactionsForAccount.mockRejectedValueOnce()
    expect(BalancesService.calculateBalanceForAccount(account)).resolves.toBeNull()
  })
})
