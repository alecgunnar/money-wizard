import TransactionRow from '@/components/lists/TransactionRow'
import DialogsUtil from '@/utils/dialogs'
import TransactionsClient from '@/clients/transactions'
import {shallowMount} from '@vue/test-utils'

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
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=reason]').text()).toBe('just because')
  })

  it('shows expanded content when the row is clicked', async () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content]').exists()).toBeTruthy()
  })

  it('does not show expanded content when the row has not been clicked', async () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })
    expect(subject.find('[data-qa=expanded-content]').exists()).toBeFalsy()
  })

  it('hides the expanded content when the row is clicked again', async () => {
    const subject = shallowMount(TransactionRow, {
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
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=expanded-content] [data-qa=notes]').exists()).toBeTruthy()
  })

  it('shows the notes', async () => {
    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$10.00')
  })

  it('there is a button to delete the transaction when the row is expanded', async () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    expect(subject.find('button[data-qa=delete]').exists()).toBeTruthy()
  })

  it('there is no button to delete the transaction when the row is not expanded', async () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=delete]').exists()).toBeFalsy()
  })

  it('transaction deletion confirmation is requested', async () => {
    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    subject.trigger('click')
    await subject.vm.$nextTick()
    subject.find('[data-qa=delete]').trigger('click')
    const callback = DialogsUtil.confirm.mock.calls[0][0]
    callback()
    expect(TransactionsClient.deleteTransaction).toBeCalledWith('9762e721-9cf2-4165-8495-6ef69f6d2fd9')
  })

  it('emits event when the transaction is deleted successfully', async () => {
    TransactionsClient.deleteTransaction.mockResolvedValueOnce()

    const subject = shallowMount(TransactionRow, {
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

    const subject = shallowMount(TransactionRow, {
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
