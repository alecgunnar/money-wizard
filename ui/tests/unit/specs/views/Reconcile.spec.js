import Reconcile from '@/views/Reconcile'
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import {shallowMount} from '@vue/test-utils'

describe('Reconcile', () => {
  it('shows the expected balance form', () => {
    const subject = shallowMount(Reconcile, {
      propsData: {
        id: 1234
      }
    })
    expect(subject.findComponent(ExpectedBalanceForm).exists()).toBeTruthy()
  })

  it('sends the user back to the account page when the form is canceled', () => {
    const push = jest.fn()
    const subject = shallowMount(Reconcile, {
      mocks: {
        $router: {
          push
        }
      },
      propsData: {
        id: 1234
      }
    })

    subject.findComponent(ExpectedBalanceForm).vm.$emit('canceled')
    expect(push).toBeCalledWith({
      name: 'account',
      params: {
        id: 1234
      }
    })
  })
})