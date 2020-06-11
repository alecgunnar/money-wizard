import transactions from '@/store/transactions'
import client from '@/clients'

jest.mock('@/clients')

describe('transactions module', () => {
  it('makes a request to load transactions', () => {
    const fetchedTransactions = [
      {id: '123', reason: 'test'}
    ]

    client.get.mockResolvedValueOnce({
      data: fetchedTransactions
    })

    transactions.actions.loadTransactions({
      commit: jest.fn()
    })

    expect(client.get).toBeCalledWith('/transactions')
  })

  it('stores the transactions that are loaded', async () => {
    const fetchedTransactions = [
      {id: '123', reason: 'test'}
    ]

    client.get.mockResolvedValueOnce({
      data: fetchedTransactions
    })

    const commit = jest.fn()

    await transactions.actions.loadTransactions({commit})

    expect(commit).toBeCalledWith('transactionsLoaded', fetchedTransactions)
  })

  it('stores error when loading transactions fails', async () => {
    client.get.mockRejectedValueOnce({
      msg: 'err'
    })

    const commit = jest.fn()

    await transactions.actions.loadTransactions({commit})

    expect(commit).toBeCalledWith('encounteredServerError', 'Could not load transactions.')
  })
})
