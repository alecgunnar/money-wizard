import TransactionRow from '@/components/lists/TransactionRow'
import {shallowMount} from '@vue/test-utils'

const transaction = {
  id: '9762e721-9cf2-4165-8495-6ef69f6d2fd9',
  date: '2020-05-28',
  reason: 'just because',
  amount: 10.00,
  notes: 'well, I do not need a reason'
}

describe('TransactionRow', () => {
  it('shows the reason', () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=reason]').text()).toBe('just because')
  })

  it('shows the amount', () => {
    const subject = shallowMount(TransactionRow, {
      propsData: {
        transaction
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
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
})
