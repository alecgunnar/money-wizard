import ReconcilableTransactionsList from '@/components/lists/ReconcilableTransactionsList'
import ReconcilableTransactionRow from '@/components/lists/ReconcilableTransactionRow'
import {shallowMount} from '@vue/test-utils'

describe('Reconcilable Transactions List', () => {
  it('shows a row for each transactions', () => {
    const subject = shallowMount(ReconcilableTransactionsList, {
      propsData: {
        transactions: [
          {
            type: 'debit',
            amount: 10
          },
          {
            type: 'credit',
            amount: 14
          }
        ]
      }
    })

    expect(subject.findAllComponents(ReconcilableTransactionRow).length).toBe(2)
  })
})