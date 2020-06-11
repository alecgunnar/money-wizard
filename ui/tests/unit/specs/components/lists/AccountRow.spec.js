import AccountRow from '@/components/lists/AccountRow'
import {shallowMount} from '@vue/test-utils'

const account = {
  name: 'Sample Test',
  balance: 10245.45
}

describe('AccountRow', () => {
  it('shows the account name', () => {
    const subject = shallowMount(AccountRow, {
      propsData: {
        account
      }
    })

    expect(subject.find('[data-qa=name]').text()).toBe('Sample Test')
  })

  it('shows the account balance', () => {
    const subject = shallowMount(AccountRow, {
      propsData: {
        account
      }
    })

    expect(subject.find('[data-qa=balance]').text()).toBe('$10,245.45')
  })
})
