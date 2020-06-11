import NewAccountForm from '@/components/forms/NewAccountForm'
import {shallowMount} from '@vue/test-utils'

describe('NewAccountForm', () => {
  it('has a field to enter the name of the account', () => {
    const subject = shallowMount(NewAccountForm)
    expect(subject.find('input[data-qa=name-input]').exists()).toBeTruthy()
  })

  it('has a field to choose the type of the account', () => {
    const subject = shallowMount(NewAccountForm)
    expect(subject.find('select[data-qa=account-type]').exists()).toBeTruthy()
  })

  it('has a submit button', () => {
    const subject = shallowMount(NewAccountForm)
    expect(subject.find('button[type=submit][data-qa=submit]').exists()).toBeTruthy()
  })

  it('has a cancel button', () => {
    const subject = shallowMount(NewAccountForm)
    expect(subject.find('button[type=button][data-qa=cancel]').exists()).toBeTruthy()
  })

  it('event is emitted when cancel is clicked', () => {
    const subject = shallowMount(NewAccountForm)
    subject.find('[data-qa=cancel]').trigger('click')
    expect(subject.emitted('cancel')).not.toBeUndefined()
  })
})
