import Transactions from '@/views/Transactions'
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import TransactionRow from '@/components/lists/TransactionRow'
import transactions from '@/store/transactions'
import Vuex from 'vuex'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

const loadTransactions = jest.fn()

const store = new Vuex.Store({
  modules: {
    transactions: {
      ...transactions,
      actions: {
        loadTransactions
      }
    }
  }
});

describe('Transactions', () => {
  beforeEach(() => {
    store.commit('clearTransactions')
  })

  it('loads transactions', () => {
    shallowMount(Transactions, {localVue, store})
    expect(loadTransactions).toHaveBeenCalled()
  })

  it('has a button to create new transaction', () => {
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.find('button[data-qa=new-transaction]').exists()).toBeTruthy()
  })

  it('shows a form to create a new transaction', async () => {
    const subject = shallowMount(Transactions, {localVue, store})
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeTruthy()
  })

  it('props the form with the account to preselect', async () => {
    const subject = shallowMount(Transactions, {
      propsData: {
        id: '234'
      }, localVue, store
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).props('preselect')).toBe('234')
  })

  it('hides the form when the form is canceled', async () => {
    const subject = shallowMount(Transactions, {localVue, store})
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('cancel')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('hides the form when the form is submitted', async () => {
    const subject = shallowMount(Transactions, {localVue, store})
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('reloads the transactions when the form is submitted', async () => {
    const subject = shallowMount(Transactions, {localVue, store})
    jest.resetAllMocks()
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    expect(loadTransactions).toHaveBeenCalled()
  })

  it('does not show new transaction form by default', () => {
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('renders a list of transactions', () => {
    store.commit('transactionsLoaded', [
      {id: '123', amount: 10.53, type: 'credit'}
    ])
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.find('[data-qa=transactions-list]').exists()).toBeTruthy()
  })

  it('renders each transaction', () => {
    store.commit('transactionsLoaded', [
      {id: '123', amount: 10.53, type: 'credit'},
      {id: '456', amount: 3.33, type: 'debit'}
    ])
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.findAllComponents(TransactionRow).length).toBe(2)
  })

  it('props each transaction row', () => {
    const transaction = {id: '123', amount: 10.53, type: 'credit'}
    store.commit('transactionsLoaded', [transaction])
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.findComponent(TransactionRow).props('transaction')).toBe(transaction)
  })

  it('renders a message stating no transactions are available', () => {
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.find('[data-qa=no-transactions-msg]').exists()).toBeTruthy()
  })

  it('does not render transactions list', () => {
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.find('[data-qa=transactions-list]').exists()).toBeFalsy()
  })

  it('does not render a message stating no transactions are available', () => {
    store.commit('transactionsLoaded', [
      {id: '123', amount: 10.53, type: 'credit'}
    ])
    const subject = shallowMount(Transactions, {localVue, store})
    expect(subject.find('[data-qa=no-transactions-msg]').exists()).toBeFalsy()
  })
})
