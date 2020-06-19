const BalancesService = require('../../services/balances')
const TransactionsRepository = require('../../repositories/transactions')

jest.mock('../../repositories/transactions')

describe('Balances Service', () => {
  it('loads sum of transactions for account', () => {
    TransactionsRepository.getBalanceForAccount.mockResolvedValueOnce(10.59)
    BalancesService.calculateBalanceForAccount(1241)
    expect(TransactionsRepository.getBalanceForAccount).toBeCalledWith(1241)
  })

  it('resolves with the balance', () => {
    TransactionsRepository.getBalanceForAccount.mockResolvedValueOnce(10.59)
    expect(BalancesService.calculateBalanceForAccount(1241)).resolves.toBe(10.59)
  })

  it('resolves when the respository fails', () => {
    TransactionsRepository.getBalanceForAccount.mockRejectedValueOnce()
    expect(BalancesService.calculateBalanceForAccount(1241)).resolves.toBeNull()
  })
})
