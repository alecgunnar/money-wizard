import TransactionRow from '@/components/lists/TransactionRow'
import {shallowMount} from '@vue/test-utils'

const transaction = {
  id: '9762e721-9cf2-4165-8495-6ef69f6d2fd9',
  date: '2020-05-28',
  reason: 'just because',
  amount: 10.00
}

describe('TransactionRow', () => {
  it('shows the date', () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=date]').text()).toBe('May 28, 2020')
  })

  it('shows the amount', () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
  })

  it('shows the reason', () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=reason]').text()).toBe('just because')
  })

  it('shows a negative amount', () => {
    transaction.amount = -41.23

    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$41.23')
  })
})
