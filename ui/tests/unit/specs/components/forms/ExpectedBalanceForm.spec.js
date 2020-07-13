import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import {shallowMount} from '@vue/test-utils'

describe('Expected Balance Form', () => {
  it('there is a field to enter the expected balance', () => {
    const subject = shallowMount(ExpectedBalanceForm)
    expect(subject.find('input[data-qa=expected-balance]').exists()).toBeTruthy()
  })

  it('there is a button to submit the expected balance', () => {
    const subject = shallowMount(ExpectedBalanceForm)
    expect(subject.find('button[type=submit][data-qa=continue]').exists()).toBeTruthy()
  })

  it('the expected balance input and the continue button are in the same form', () => {
    const subject = shallowMount(ExpectedBalanceForm)
    expect(subject.find('form[data-qa=begin-reconciliation] [data-qa=expected-balance]').exists()).toBeTruthy()
    expect(subject.find('form[data-qa=begin-reconciliation] [data-qa=continue]').exists()).toBeTruthy()
  })

  it('when the init form is submitted without an amount, an error is shown', async () => {
    const subject = shallowMount(ExpectedBalanceForm)
    subject.find('form[data-qa=begin-reconciliation]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=enter-an-amount-error]').exists()).toBeTruthy()
  })

  it('does not show the enter an amount error by default', () => {
    const subject = shallowMount(ExpectedBalanceForm)
    expect(subject.find('[data-qa=enter-an-amount-error]').exists()).toBeFalsy()
  })

  it('does not show the enter an amount error when an amount is entered', async () => {
    const subject = shallowMount(ExpectedBalanceForm)
    subject.find('[data-qa=expected-balance]').setValue('10.99')
    subject.find('form[data-qa=begin-reconciliation]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=enter-an-amount-error]').exists()).toBeFalsy()
  })

  it('when the expected amount is not numeric an error is shown', async () => {
    const subject = shallowMount(ExpectedBalanceForm)
    subject.find('[data-qa=expected-balance]').setValue('abc123')
    subject.find('form[data-qa=begin-reconciliation]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=enter-numeric-amount-error]').exists()).toBeTruthy()
  })

  it('when the expected amount is numeric an error is not shown', async () => {
    const subject = shallowMount(ExpectedBalanceForm)
    subject.find('[data-qa=expected-balance]').setValue('10.99')
    subject.find('form[data-qa=begin-reconciliation]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=enter-numeric-amount-error]').exists()).toBeFalsy()
  })

  it('when the expected amount is empty a non-numeric error is not shown', async () => {
    const subject = shallowMount(ExpectedBalanceForm)
    subject.find('[data-qa=expected-balance]').setValue('')
    subject.find('form[data-qa=begin-reconciliation]').trigger('submit')
    await subject.vm.$nextTick()
    expect(subject.find('[data-qa=enter-numeric-amount-error]').exists()).toBeFalsy()
  })
})