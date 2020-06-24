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
            type: 'asset',
            balance: 10.31
          },
          {
            id: 2,
            type: 'asset',
            balance: 14.11
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
            type: 'asset',
            balance: 10.31
          }
        ]
      }
    })

    expect(subject.findComponent(AccountRow).props('account')).toEqual({
      id: 1,
      type: 'asset',
      balance: 10.31
    })
  })

  it('sums the balances of all accounts', () => {
    const subject = shallowMount(AccountsList, {
      propsData: {
        accounts: [
          {
            id: 1,
            type: 'asset',
            balance: 10.31
          },
          {
            id: 2,
            type: 'asset',
            balance: 14.11
          }
        ]
      }
    })

    expect(subject.find('[data-qa=total-balance]').text()).toBe('$24.42')
  })

  it('sums the balances of all accounts when balances are rounded', () => {
    const subject = shallowMount(AccountsList, {
      propsData: {
        accounts: [
          {
            id: 1,
            type: 'asset',
            balance: 10
          },
          {
            id: 2,
            type: 'asset',
            balance: 14
          }
        ]
      }
    })

    expect(subject.find('[data-qa=total-balance]').text()).toBe('$24.00')
  })
})
