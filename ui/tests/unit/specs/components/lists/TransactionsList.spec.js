import TransactionsList from '@/components/lists/TransactionsList'
import TransactionRow from '@/components/lists/TransactionRow'
import {shallowMount} from '@vue/test-utils'

describe('TransactionsList', () => {
  it('renders the date', () => {
    const subject = shallowMount(TransactionsList, {
      propsData: {
        date: '2020-07-06',
        transactions: [
          {
            amount: 123
          }
        ]
      }
    })

    expect(subject.find('[data-qa=date-of-transactions]').text()).toBe('July 6, 2020')
  })

  it('renders each transaction row', () => {
    const subject = shallowMount(TransactionsList, {
      propsData: {
        date: '2020-07-06',
        transactions: [
          {
            id: 1,
            amount: 123
          },
          {
            id: 2,
            amount: 77.31
          }
        ]
      }
    })

    expect(subject.findAllComponents(TransactionRow).length).toBe(2)
  })

  it('props the transaction row', () => {
    const transaction = {
      id: 1,
      amount: 123
    }

    const subject = shallowMount(TransactionsList, {
      propsData: {
        date: '2020-07-06',
        transactions: [
          transaction
        ]
      }
    })

    expect(subject.findComponent(TransactionRow).props('transaction')).toEqual(transaction)
  })
})
