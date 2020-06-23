import AccountsList from '@/components/lists/AccountsList'
import AccountRow from '@/components/lists/AccountRow'
import {shallowMount} from '@vue/test-utils'

describe('AccountsList', () => {
  it('shows each account', () => {
    const subject = shallowMount(AccountsList, {
      propsData: {
        accounts: [
          {
            id: 1,
            type: 'debit',
            amount: 10.31
          },
          {
            id: 2,
            type: 'debit',
            amount: 14.11
          }
        ]
      }
    })

    expect(subject.findAllComponents(AccountRow).length).toBe(2)
  })

  it('props the account data to the row', () => {
    const subject = shallowMount(AccountsList, {
      propsData: {
        accounts: [
          {
            id: 1,
            type: 'debit',
            amount: 10.31
          }
        ]
      }
    })

    expect(subject.findComponent(AccountRow).props('account')).toEqual({
      id: 1,
      type: 'debit',
      amount: 10.31
    })
  })
})
