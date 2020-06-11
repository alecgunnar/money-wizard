import accounts from '@/store/accounts'
import client from '@/clients'

jest.mock('@/clients')

const commit = jest.fn()

describe('accounts module', () => {
  it('requests the accounts', () => {
    const fetchedAccounts = [
      {id: '123', name: 'test', balance: 1.45}
    ]

    client.get.mockResolvedValueOnce({
      data: fetchedAccounts
    })

    accounts.actions.loadAccounts({commit})

    expect(client.get).toBeCalledWith('/accounts')
  })

  it('stores the loaded accounts', async () => {
    const fetchedAccounts = [
      {id: '123', name: 'test', balance: 1.45}
    ]

    client.get.mockResolvedValueOnce({
      data: fetchedAccounts
    })

    await accounts.actions.loadAccounts({commit})

    expect(commit).toBeCalledWith('loadedAccounts', fetchedAccounts)
  })

  it('saves the accounts to state', () => {
    const state = {
      accounts: []
    }

    const account = {id: '123', name: 'test', balance: 1.45}

    accounts.mutations.loadedAccounts(state, [account])

    expect(state.accounts).toStrictEqual([account])
  })

  it('stores error when loading accounts fails', async () => {
    client.get.mockRejectedValueOnce('Err.')

    await accounts.actions.loadAccounts({commit})

    expect(commit).toBeCalledWith('encounteredServerError', 'Could not load accounts.')
  })
})