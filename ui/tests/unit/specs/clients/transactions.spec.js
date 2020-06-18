import TransactionsClient from '@/clients/transactions'
import RootClient from '@/clients'

jest.mock('@/clients')

describe('Transactions Client', () => {
  it('makes a post request to add transaction', () => {
    RootClient.post.mockResolvedValueOnce()
    TransactionsClient.addTransaction(1234, 'debit', '10', '05/28/1994', 'Something')
    expect(RootClient.post).toHaveBeenCalled()
  })

  it('posts to the backend with the data', () => {
    RootClient.post.mockResolvedValueOnce()
    TransactionsClient.addTransaction(1234, 'debit', '10', '05/28/1994', 'Something')
    expect(RootClient.post).toHaveBeenCalledWith('/transactions', {
      account: 1234,
      type: 'debit',
      amount: '10',
      date: '05/28/1994',
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
})
