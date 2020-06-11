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
})
