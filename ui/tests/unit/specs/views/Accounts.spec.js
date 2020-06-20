import Accounts from '@/views/Accounts'
import AccountRow from '@/components/lists/AccountRow'
import NewAccountForm from '@/components/forms/NewAccountForm'
import accounts from '@/store/accounts'
import Vuex from 'vuex'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

const loadAccounts = jest.fn()

const store = new Vuex.Store({
  modules: {
    accounts: {
      ...accounts,
      actions: {
        loadAccounts
      }
    }
  }
})

describe('Accounts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('loads all accounts', () => {
    const subject = shallowMount(Accounts, {store, localVue})
    expect(loadAccounts).toBeCalled()
  })

  it('show no accounts available message', () => {
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=no-accounts-msg]').exists()).toBeTruthy()
  })

  it('shows the list of asset accounts', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'asset'
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=list-of-asset-accounts]').exists()).toBeTruthy()
  })

  it('does not show the list of asset accounts when there are no asset accounts', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=list-of-asset-accounts]').exists()).toBeFalsy()
  })

  it('shows the list of credit accounts', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'credit'
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=list-of-credit-accounts]').exists()).toBeTruthy()
  })

  it('does not show the list of credit accounts when there are no credit accounts', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33,
        type: 'asset'
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=list-of-credit-accounts]').exists()).toBeFalsy()
  })

  it('shows each of the asset accounts', () => {
    store.commit('loadedAccounts', [
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

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findAllComponents(AccountRow).length).toBe(2)
  })

  it('supplies the asset account data to the row', () => {
    const account = {
      id: '123',
      name: 'Sample',
      balance: 10.33,
      type: 'asset'
    }

    store.commit('loadedAccounts', [account])
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findComponent(AccountRow).props('account')).toBe(account)
  })

  it('shows each of the credit accounts', () => {
    store.commit('loadedAccounts', [
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

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findAllComponents(AccountRow).length).toBe(2)
  })

  it('supplies the credit account data to the row', () => {
    const account = {
      id: '123',
      name: 'Sample',
      balance: 10.33,
      type: 'credit'
    }

    store.commit('loadedAccounts', [account])
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findComponent(AccountRow).props('account')).toBe(account)
  })

  it('does not show the no accounts message when there is only an asset account', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=no-accounts-msg]').exists()).toBeFalsy()
  })

  it('does not show the accounts list', () => {
    store.commit('loadedAccounts', [])
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=list-of-accounts]').exists()).toBeFalsy()
  })

  it('there is a button for adding accounts', () => {
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('button[data-qa=add-account-btn]').exists()).toBeTruthy()
  })

  it('clicking the add account button opens the form', async () => {
    const subject = shallowMount(Accounts, {store, localVue})
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeTruthy()
  })

  it('does not show the new account form by default', () => {
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })

  it('the form emitting cancel causes form to go away', async () => {
    const subject = shallowMount(Accounts, {store, localVue})
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewAccountForm).vm.$emit('cancel')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })

  it('the form emitting submitted causes form to go away', async () => {
    const subject = shallowMount(Accounts, {store, localVue})
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewAccountForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })

  it('the form emitting submitted causes accounts to be reloaded', async () => {
    const subject = shallowMount(Accounts, {store, localVue})
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewAccountForm).vm.$emit('submitted')
    expect(loadAccounts).toBeCalledTimes(2)
  })
})
