import Accounts from '@/views/Accounts'
import AccountRow from '@/components/lists/AccountRow'
import AccountsList from '@/components/lists/AccountsList'
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
    expect(subject.findComponent({
      ref: 'assetList'
    }).exists()).toBeTruthy()
  })

  it('props the asset accounts list with asset accounts', async () => {
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
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent({
      ref: 'assetList'
    }).props('accounts')).toEqual([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'asset'
      }
    ])
  })

  it('does not show the list of asset accounts when there are no asset accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent(AccountsList).exists()).toBeFalsy()
  })

  it('shows the list of loan accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'loan'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent({
      ref: 'loanList'
    }).exists()).toBeTruthy()
  })

  it('props the loan accounts list with loan accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'loan'
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
    expect(subject.findComponent({
      ref: 'loanList'
    }).props('accounts')).toEqual([
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'loan'
      }
    ])
  })

  it('does not show the list of loan accounts when there are no loan accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent(AccountsList).exists()).toBeFalsy()
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
    expect(subject.findComponent(AccountsList).exists()).toBeTruthy()
  })

  it('props the credit accounts list with credit accounts', async () => {
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
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent({
      ref: 'creditList'
    }).props('accounts')).toEqual([
      {
        id: '456',
        name: 'other',
        balance: 9.99,
        type: 'credit'
      }
    ])
  })

  it('does not show the list of credit accounts when there are no credit accounts', async () => {
    AccountsClient.getAccounts.mockResolvedValueOnce([])

    const subject = shallowMount(Accounts)
    await subject.vm.$nextTick()
    expect(subject.findComponent(AccountsList).exists()).toBeFalsy()
  })

  it('does not show the no accounts message when there is only an asset account', async () => {
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
    expect(subject.find('[data-qa=no-accounts-msg]').exists()).toBeFalsy()
  })

  it('does not show the no accounts message when there is only an credit account', async () => {
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
