import AccountRow from '@/components/lists/AccountRow'
import Router from 'vue-router'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Router)

const account = {
  id: 'dfc2a92a-429f-4518-92fa-d919af6ad704',
  name: 'Sample Test',
  balance: 10245.45
}

describe('AccountRow', () => {
  it('shows the account name', () => {
    const subject = shallowMount(AccountRow, {
      localVue,
      propsData: {
        account
      }
    })

    expect(subject.find('[data-qa=name]').text()).toBe('Sample Test')
  })

  it('shows the account balance', () => {
    const subject = shallowMount(AccountRow, {
      localVue,
      propsData: {
        account
      }
    })

    expect(subject.find('[data-qa=balance]').text()).toBe('$10,245.45')
  })
})
