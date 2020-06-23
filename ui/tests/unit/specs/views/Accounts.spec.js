import Accounts from '@/views/Accounts'
import AccountRow from '@/components/lists/AccountRow'
import NewAccountForm from '@/components/forms/NewAccountForm'
import AccountsClient from '@/clients/accounts'
import {shallowMount} from '@vue/test-utils'

jest.mock('@/clients/accounts')

describe('Accounts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('loads all accounts', () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    shallowMount(Accounts)
    expect(AccountsClient.getAccounts).toBeCalled()
  })

  it('show no accounts available message', () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    expect(subject.find('[data-qa=no-accounts-msg]').exists()).toBeTruthy()
  })

  it('shows the list of asset accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'asset'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=list-of-asset-accounts]').exists()).toBeTruthy()
  })

  it('does not show the list of asset accounts when there are no asset accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=list-of-asset-accounts]').exists()).toBeFalsy()
  })

  it('shows the list of credit accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=list-of-credit-accounts]').exists()).toBeTruthy()
  })

  it('does not show the list of credit accounts when there are no credit accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'asset'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=list-of-credit-accounts]').exists()).toBeFalsy()
  })

  it('shows each of the asset accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'asset'
      },
      {
        id: '456',
        name: 'other',
        balance: 9.99,
        type: 'asset'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findAllComponents(AccountRow).length).toBe(2)
  })

  it('supplies the asset account data to the row', async () => {
    const account = {
      id: '123',
      name: 'Sample',
      balance: 10.33,
      type: 'asset'
    }

    AccountsClient.getAccounts.mockResolvedValueOnce([account])
    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent(AccountRow).props('account')).toBe(account)
  })

  it('shows each of the credit accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'credit'
      },
      {
        id: '456',
        name: 'other',
        balance: 9.99,
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findAllComponents(AccountRow).length).toBe(2)
  })

  it('supplies the credit account data to the row', async () => {
    const account = {
      id: '123',
      name: 'Sample',
      balance: 10.33,
      type: 'credit'
    }

    AccountsClient.getAccounts.mockResolvedValueOnce([account])
    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent(AccountRow).props('account')).toBe(account)
  })

  it('does not show the no accounts message when there is only an asset account', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=no-accounts-msg]').exists()).toBeFalsy()
  })

  it('does not show the accounts list', () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    expect(subject.find('[data-qa=list-of-accounts]').exists()).toBeFalsy()
  })

  it('there is a button for adding accounts', () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    expect(subject.find('button[data-qa=add-account-btn]').exists()).toBeTruthy()
  })

  it('clicking the add account button opens the form', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeTruthy()
  })

  it('does not show the new account form by default', () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })

  it('the form emitting cancel causes form to go away', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewAccountForm).vm.$emit('cancel')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })

  it('the form emitting submitted causes form to go away', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    subject.findComponent(NewAccountForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })

  it('the form emitting submitted causes accounts to be reloaded', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    const subject = shallowMount(Accounts)
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    AccountsClient.getAccounts.mockResolvedValueOnce([])
    subject.findComponent(NewAccountForm).vm.$emit('submitted')
    expect(AccountsClient.getAccounts).toBeCalled()
  })
})
