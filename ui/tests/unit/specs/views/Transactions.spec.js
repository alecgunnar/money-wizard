import Transactions from '@/views/Transactions'
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import TransactionsList from '@/components/lists/TransactionsList'
import TransactionsClient from '@/clients/transactions'
import {shallowMount} from '@vue/test-utils'

jest.mock('@/clients/transactions')

describe('Transactions', () => {
  it('loads transactions', () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    shallowMount(Transactions)
    expect(TransactionsClient.getTransactions).toHaveBeenCalled()
  })

  it('has a button to create new transaction', () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    expect(subject.find('button[data-qa=new-transaction]').exists()).toBeTruthy()
  })

  it('shows a form to create a new transaction', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeTruthy()
  })

  it('props the form with the account to preselect', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions, {
      propsData: {
        id: '234'
      }
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).props('preselect')).toBe('234')
  })

  it('hides the form when the form is canceled', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('cancel')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('hides the form when the form is submitted', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('reloads the transactions when the form is submitted', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    jest.resetAllMocks()
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    expect(TransactionsClient.getTransactions).toHaveBeenCalled()
  })

  it('does not show new transaction form by default', () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('renders a message stating no transactions are available', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=no-transactions-msg]').exists()).toBeTruthy()
  })

  it('does not render transactions', async () => {
    TransactionsClient.getTransactions.mockResolvedValueOnce({})
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=transactions-list]').exists()).toBeFalsy()
  })

  it('does not render a message stating no transactions are available', async () => {
    jest.resetAllMocks()
    TransactionsClient.getTransactions.mockResolvedValueOnce({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=no-transactions-msg]').exists()).toBeFalsy()
  })

  it('renders lists of transactions', async () => {
    jest.resetAllMocks()
    TransactionsClient.getTransactions.mockResolvedValueOnce({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=lists-of-transactions]').exists()).toBeTruthy()
  })

  it('renders each list of transactions', async () => {
    jest.resetAllMocks()
    TransactionsClient.getTransactions.mockResolvedValueOnce({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ],
      '2020-06-06': [
        {id: '456', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    expect(subject.findAllComponents(TransactionsList).length).toBe(2)
  })

  it('props transaction list with the date', async () => {
    jest.resetAllMocks()
    TransactionsClient.getTransactions.mockResolvedValueOnce({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    const list = subject.findComponent(TransactionsList)
    expect(list.props('date')).toBe('2020-07-06')
  })

  it('props transaction list with the transactions', async () => {
    jest.resetAllMocks()
    const transactions = [
      {id: '123', amount: 10.53, type: 'credit'}
    ]
    TransactionsClient.getTransactions.mockResolvedValueOnce({
      '2020-07-06': transactions
    })
    const subject = shallowMount(Transactions)
    await subject.vm.$nextTick()
    const list = subject.findComponent(TransactionsList)
    expect(list.props('transactions')).toEqual(transactions)
  })
})
