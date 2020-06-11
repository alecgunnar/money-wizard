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

  it('shows an error when submitting empty name', async () => {
    const subject = shallowMount(NewAccountForm)
    subject.find('form[data-qa=new-account-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=empty-name-error]').exists()).toBeTruthy()
  })

  it('does not show a name error by default', () => {
    const subject = shallowMount(NewAccountForm)
    expect(subject.find('[data-qa=empty-name-error]').exists()).toBeFalsy()
  })

  it('shows an error when submitted without type', async () => {
    const subject = shallowMount(NewAccountForm)
    subject.find('form[data-qa=new-account-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=without-type-error]').exists()).toBeTruthy()
  })

  it('does not show a type error by default', () => {
    const subject = shallowMount(NewAccountForm)
    expect(subject.find('[data-qa=without-type-error]').exists()).toBeFalsy()
  })

  it('submitting with a name does not show an error', async () => {
    const subject = shallowMount(NewAccountForm)
    subject.find('[data-qa=name-input]').setValue('sample')
    subject.find('form[data-qa=new-account-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=empty-name-error]').exists()).toBeFalsy()
  })

  it('submitting with a type selected does not show an error', async () => {
    const subject = shallowMount(NewAccountForm)
    subject.find('[data-qa=account-type]').setValue('asset')
    subject.find('form[data-qa=new-account-form]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=without-type-error]').exists()).toBeFalsy()
  })
})
