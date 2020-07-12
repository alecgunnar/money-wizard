import TransactionRow from '@/components/lists/TransactionRow'
import DialogsUtil from '@/utils/dialogs'
import TransactionsClient from '@/clients/transactions'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

let store

const setupTest = (dltTrnsctn = null) => {
  store = new Vuex.Store({
    modules: {
      transactions: {
        actions: {
          deleteTransaction: dltTrnsctn || jest.fn()
        }
      }
    }
  })
}

const transaction = {
  id: '9762e721-9cf2-4165-8495-6ef69f6d2fd9',
  date: '2020-05-28',
  reason: 'just because',
  amount: 10.00,
  notes: 'well, I do not need a reason',
  type: 'debit',
  account: {
    name: 'money receptacal',
    type: 'asset'
  }
}

jest.mock('@/utils/dialogs')
jest.mock('@/clients/transactions')

describe('TransactionRow', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('shows the reason', () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=reason]').text()).toBe('just because')
  })

  it('shows expanded content when the row is clicked', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content]').exists()).toBeTruthy()
  })

  it('does not show expanded content when the row has not been clicked', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })
    expect(subject.find('[data-qa=expanded-content]').exists()).toBeFalsy()
  })

  it('hides the expanded content when the row is clicked again', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content]').exists()).toBeFalsy()
  })

  it('the expanded contents contains the notes', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content] [data-qa=notes]').exists()).toBeTruthy()
  })

  it('shows the notes', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content] [data-qa=notes]').text()).toBe('well, I do not need a reason')
  })

  it('shows message when notes are empty', async () => {
    transaction.notes = ''

    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content] [data-qa=notes]').text()).toBe('–')
  })

  it('shows asset account debit as negative amount', () => {
    transaction.amount = 10
    transaction.type = 'debit'
    transaction.account.type = 'asset'

    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$10.00')
  })

  it('shows asset account credit as positive amount', () => {
    transaction.amount = 10
    transaction.type = 'credit'
    transaction.account.type = 'asset'

    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
  })

  it('shows credit account debit as positive amount', () => {
    transaction.amount = 10
    transaction.type = 'debit'
    transaction.account.type = 'credit'

    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
  })

  it('shows credit account credit as negative amount', () => {
    transaction.amount = 10
    transaction.type = 'credit'
    transaction.account.type = 'credit'

    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$10.00')
  })

  it('there is a button to delete the transaction when the row is expanded', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('button[data-qa=delete]').exists()).toBeTruthy()
  })

  it('there is no button to delete the transaction when the row is not expanded', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=delete]').exists()).toBeFalsy()
  })

  it('transaction deletion confirmation is requested', async () => {
    setupTest()

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    subject.find('[data-qa=delete]').trigger('click')

    expect(DialogsUtil.confirm).toBeCalledWith(expect.any(Function))
  })

  it('deletes the transaction', async () => {
    TransactionsClient.deleteTransaction.mockResolvedValueOnce()

    const deleteTr = jest.fn()
    setupTest(deleteTr)

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    subject.find('[data-qa=delete]').trigger('click')
    const callback = DialogsUtil.confirm.mock.calls[0][0]
    callback()
    expect(deleteTr).toBeCalledWith(expect.any(Object), '9762e721-9cf2-4165-8495-6ef69f6d2fd9')
  })

  it('emits event when the transaction is deleted successfully', async () => {
    TransactionsClient.deleteTransaction.mockResolvedValueOnce()

    const deleteTr = jest.fn()
    deleteTr.mockResolvedValueOnce(true)

    setupTest(deleteTr)

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    subject.find('[data-qa=delete]').trigger('click')
    const callback = DialogsUtil.confirm.mock.calls[0][0]
    callback()
    await subject.vm.$nextTick()
    expect(subject.emitted().deleted).not.toBeUndefined()
  })

  it('does not emit event when the transaction is not deleted successfully', async () => {
    TransactionsClient.deleteTransaction.mockRejectedValueOnce()

    const deleteTr = jest.fn()
    deleteTr.mockResolvedValueOnce(false)

    setupTest(deleteTr)

    const subject = shallowMount(TransactionRow, {
      localVue,
      store,
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    subject.find('[data-qa=delete]').trigger('click')
    const callback = DialogsUtil.confirm.mock.calls[0][0]
    callback()
    await subject.vm.$nextTick()
    expect(subject.emitted().deleted).toBeUndefined()
  })
})
