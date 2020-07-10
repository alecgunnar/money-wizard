import Transactions from '@/views/Transactions'
import NewTransactionForm from '@/components/forms/NewTransactionForm'
import TransactionsList from '@/components/lists/TransactionsList'
import TransactionsClient from '@/clients/transactions'
import AccountsClient from '@/clients/accounts'
import {shallowMount} from '@vue/test-utils'

jest.mock('@/clients/transactions')
jest.mock('@/clients/accounts')

const setupTest = (transactions = {}, account = null) => {
  TransactionsClient.getTransactions.mockResolvedValueOnce(transactions)

  AccountsClient.getAccount.mockResolvedValueOnce(account || {
    name: 'Sample',
    balance: 1.21
  })
}

describe('Transactions', () => {
  it('loads accounts', () => {
    setupTest()
    shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    expect(AccountsClient.getAccount).toBeCalledWith(1234)
  })

  it('shows the account title', async() => {
    setupTest({}, {
      name: 'This is the account',
      balance: 1.21
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=account-name]').text()).toBe('This is the account')
  })

  it('shows the account balance', async() => {
    setupTest({}, {
      name: 'This is the account',
      balance: 1.21
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=account-balance]').text()).toBe('$1.21')
  })

  it('loads transactions', () => {
    setupTest()
    shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    expect(TransactionsClient.getTransactions).toHaveBeenCalled()
  })

  it('loads transactions for the account when one is specified', () => {
    setupTest()
    shallowMount(Transactions, {
      propsData: {
        id: 123
      }
    })
    expect(TransactionsClient.getTransactions).toHaveBeenCalledWith(123)
  })

  it('has a button to create new transaction', () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    expect(subject.find('button[data-qa=new-transaction]').exists()).toBeTruthy()
  })

  it('shows a form to create a new transaction', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeTruthy()
  })

  it('props the form with the account to preselect', async () => {
    setupTest()
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
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('cancel')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('hides the form when the form is submitted', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    setupTest()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('reloads the transactions when the form is submitted', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    jest.resetAllMocks()
    setupTest()
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    expect(TransactionsClient.getTransactions).toHaveBeenCalled()
  })

  it('shows the reloaded transactions', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    jest.resetAllMocks()
    setupTest({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=lists-of-transactions]').exists()).toBeTruthy()
  })

  it('reloads the account data when the form is submitted', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    jest.resetAllMocks()
    setupTest()
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    expect(AccountsClient.getAccount).toHaveBeenCalledWith(1234)
  })

  it('shows the updated account data', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    jest.resetAllMocks()
    setupTest({}, {
      name: 'Sample',
      balance: 100.21
    })
    subject.find('[data-qa=new-transaction]').trigger('click')
    await subject.vm.$nextTick()
    subject.findComponent(NewTransactionForm).vm.$emit('submitted')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=account-name]').text()).toBe('Sample')
    expect(subject.find('[data-qa=account-balance]').text()).toBe('$100.21')
  })

  it('does not show new transaction form by default', () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    expect(subject.findComponent(NewTransactionForm).exists()).toBeFalsy()
  })

  it('renders a message stating no transactions are available', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=no-transactions-msg]').exists()).toBeTruthy()
  })

  it('does not render transactions', async () => {
    setupTest()
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=transactions-list]').exists()).toBeFalsy()
  })

  it('does not render a message stating no transactions are available', async () => {
    jest.resetAllMocks()
    setupTest({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=no-transactions-msg]').exists()).toBeFalsy()
  })

  it('renders lists of transactions', async () => {
    jest.resetAllMocks()
    setupTest({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=lists-of-transactions]').exists()).toBeTruthy()
  })

  it('renders each list of transactions', async () => {
    jest.resetAllMocks()
    setupTest({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ],
      '2020-06-06': [
        {id: '456', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    expect(subject.findAllComponents(TransactionsList).length).toBe(2)
  })

  it('props transaction list with the date', async () => {
    jest.resetAllMocks()
    setupTest({
      '2020-07-06': [
        {id: '123', amount: 10.53, type: 'credit'}
      ]
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    const list = subject.findComponent(TransactionsList)
    expect(list.props('date')).toBe('2020-07-06')
  })

  it('props transaction list with the transactions', async () => {
    jest.resetAllMocks()
    const transactions = [
      {id: '123', amount: 10.53, type: 'credit'}
    ]
    setupTest({
      '2020-07-06': transactions
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    const list = subject.findComponent(TransactionsList)
    expect(list.props('transactions')).toEqual(transactions)
  })

  it('removes transaction', async () => {
    const transactions = [
      {id: '123', amount: 10.53, type: 'credit'},
      {id: '456', amount: 10.53, type: 'credit'}
    ]
    setupTest({
      '2020-07-06': transactions
    })
    const subject = shallowMount(Transactions, {
      propsData: {
        id: 1234
      }
    })
    await subject.vm.$nextTick()
    subject.findComponent(TransactionsList).vm.$emit('remove', '123')
    await subject.vm.$nextTick()
    const list = subject.findComponent(TransactionsList)
    expect(list.props('transactions')).toEqual([
      {id: '456', amount: 10.53, type: 'credit'}
    ])
  })
})
