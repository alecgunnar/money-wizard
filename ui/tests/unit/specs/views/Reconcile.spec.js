import Reconcile from '@/views/Reconcile'
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import ReconcileModule from '@/store/reconcile'
import Vuex from 'vuex'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

let store
let reconcileAccount

describe('Reconcile', () => {
  beforeEach(() => {
    reconcileAccount = jest.fn()
    store = new Vuex.Store({
      modules: {
        reconcile: {
          ...ReconcileModule,
          actions: {
            ...ReconcileModule.actions,
            reconcileAccount: reconcileAccount
          }
        }
      }
    })
  })

  it('initializes the reconciliation', () => {
    shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    expect(reconcileAccount).toBeCalledWith(expect.any(Object), 1234)
  })

  it('does not show the expected balance form until the initialization completes', () => {
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    expect(subject.findComponent(ExpectedBalanceForm).exists()).toBeFalsy()
  })

  it('shows the expected balance form once the initialization completes', async () => {
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()
    expect(subject.findComponent(ExpectedBalanceForm).exists()).toBeTruthy()
  })

  it('sends the user back to the account page when the form is canceled', async () => {
    const push = jest.fn()
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      mocks: {
        $router: {
          push
        }
      },
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()

    subject.findComponent(ExpectedBalanceForm).vm.$emit('canceled')
    expect(push).toBeCalledWith({
      name: 'account',
      params: {
        id: 1234
      }
    })
  })

  it('hides the expected balance form when the form is submitted', async () => {
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()
    subject.findComponent(ExpectedBalanceForm).vm.$emit('submitted', 10.99)
    await subject.vm.$nextTick()
    expect(subject.findComponent(ExpectedBalanceForm).exists()).toBeFalsy()
  })
})