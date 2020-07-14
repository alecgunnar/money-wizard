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

  it('shows the expected balance form', () => {
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })
    expect(subject.findComponent(ExpectedBalanceForm).exists()).toBeTruthy()
  })

  it('sends the user back to the account page when the form is canceled', () => {
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

    subject.findComponent(ExpectedBalanceForm).vm.$emit('canceled')
    expect(push).toBeCalledWith({
      name: 'account',
      params: {
        id: 1234
      }
    })
  })
})