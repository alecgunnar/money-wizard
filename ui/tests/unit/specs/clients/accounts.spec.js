import AccountsClient from '@/clients/accounts'
import RootClient from '@/clients'

jest.mock('@/clients')

describe('Accounts Client', () => {
  it('makes a request to create account', async () => {
    RootClient.post.mockResolvedValueOnce()
    await AccountsClient.createAccount('sample', 'something')
    expect(RootClient.post).toBeCalledWith('/accounts', {
      name: 'sample',
      type: 'something'
    })
  })

  it('resolves when the request is successful', () => {
    RootClient.post.mockResolvedValueOnce()
    expect(AccountsClient.createAccount('sample', 'something')).resolves.toBe('Success.')
  })

  it('rejects when the request fails', () => {
    RootClient.post.mockRejectedValueOnce()
    expect(AccountsClient.createAccount('sample', 'something')).rejects.toBeUndefined()
  })

  it('makes a request to load all accounts', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: []
    })
    await AccountsClient.getAccounts()
    expect(RootClient.get).toBeCalledWith('/accounts')
  })

  it('resolves when the request is successful', () => {
    const accounts = [
      {name: 'sample', id: 123, balance: 456}
    ]

    RootClient.get.mockResolvedValueOnce({data: accounts})
    expect(AccountsClient.getAccounts()).resolves.toEqual(accounts)
  })

  it('rejects when the request fails', () => {
    RootClient.get.mockRejectedValueOnce()
    expect(AccountsClient.getAccounts()).rejects.toBeUndefined()
  })
})
