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
  it('loads all accounts', () => {
    const subject = shallowMount(Accounts, {store, localVue})
    expect(loadAccounts).toBeCalled()
  })

  it('show no accounts available message', () => {
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=no-accounts-msg]').exists()).toBeTruthy()
  })

  it('shows the list of accounts', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.find('[data-qa=list-of-accounts]').exists()).toBeTruthy()
  })

  it('shows each of the accounts', () => {
    store.commit('loadedAccounts', [
      {
        id: '123',
        name: 'Sample',
        balance: 10.33
      },
      {
        id: '456',
        name: 'other',
        balance: 9.99
      }
    ])

    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findAllComponents(AccountRow).length).toBe(2)
  })

  it('supplies the account data to the row', () => {
    const account = {
      id: '123',
      name: 'Sample',
      balance: 10.33
    }

    store.commit('loadedAccounts', [account])
    const subject = shallowMount(Accounts, {store, localVue})
    expect(subject.findComponent(AccountRow).props('account')).toBe(account)
  })

  it('does not show the no accounts message', () => {
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

  it('has a button to close the form', async () => {
    const subject = shallowMount(Accounts, {store, localVue})
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('button[data-qa=close-form-btn]').exists()).toBeTruthy()
  })

  it('clicking close form button closes form', async () => {
    const subject = shallowMount(Accounts, {store, localVue})
    subject.find('button[data-qa=add-account-btn]').trigger('click')
    await subject.vm.$nextTick()
    subject.find('button[data-qa=close-form-btn]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewAccountForm).exists()).toBeFalsy()
  })
})
