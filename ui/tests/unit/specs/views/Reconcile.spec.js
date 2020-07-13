import Reconcile from '@/views/Reconcile'
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import {shallowMount} from '@vue/test-utils'

describe('Reconcile', () => {
  it('shows the expected balance form', () => {
    const subject = shallowMount(Reconcile)
    expect(subject.findComponent(ExpectedBalanceForm).exists()).toBeTruthy()
  })
})