
import TransactionsClient from '@/clients/transactions'
import RootClient from '@/clients'

jest.mock('@/clients')

describe('Transactions Client', () => {
  it('makes a post request to add transaction', () => {
    RootClient.post.mockResolvedValueOnce()
    TransactionsClient.addTransaction(1234, 'debit', '10', '05/28/1994', 'BECAUSE!', 'Something')
    expect(RootClient.post).toHaveBeenCalled()
  })

  it('posts to the backend with the data', () => {
    RootClient.post.mockResolvedValueOnce()
    TransactionsClient.addTransaction(1234, 'debit', '10', '05/28/1994', 'BECAUSE!', 'Something')
    expect(RootClient.post).toHaveBeenCalledWith('/transactions', {
      account: 1234,
      type: 'debit',
      amount: '10',
      date: '05/28/1994',
      reason: 'BECAUSE!',
      notes: 'Something'
    })
  })

  it('resolves if the request is successful', () => {
    RootClient.post.mockResolvedValueOnce()
    expect(
      TransactionsClient.addTransaction(1234, 'debit', '10', '05/28/1994', 'Something')
    ).resolves.toBe('Created')
  })

  it('rejects if the request is not successful', () => {
    RootClient.post.mockRejectedValueOnce()
    expect(
      TransactionsClient.addTransaction(1234, 'debit', '10', '05/28/1994', 'Something')
    ).rejects.toBeUndefined()
  })

  it('makes a get request to load transactions', () => {
    RootClient.get.mockResolvedValueOnce({
      data: {}
    })
    TransactionsClient.getTransactions()
    expect(RootClient.get).toBeCalledWith('/transactions')
  })

  it('resolves with transactions when the request succeeds', () => {
    const transactions = {
      '2020-02-02': [
        {
          amount: 4,
          type: 'debit'
        }
      ]
    }
    RootClient.get.mockResolvedValueOnce({
      data: transactions
    })
    expect(TransactionsClient.getTransactions()).resolves.toBe(transactions)
  })

  it('rejects when the request fails', () => {
    RootClient.get.mockRejectedValueOnce()
    expect(TransactionsClient.getTransactions()).rejects.toBeUndefined()
  })
})
