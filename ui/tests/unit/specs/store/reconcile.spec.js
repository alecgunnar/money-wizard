import ReconcileModule from '@/store/reconcile'
import RootClient from '@/clients'
import Vuex from 'vuex'
import {createLocalVue} from '@vue/test-utils'

jest.mock('@/clients')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Reconcile Module', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('requests account on init', () => {
    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockResolvedValueOnce({
      data: {}
    })

    subject.dispatch('reconcileAccount', 1234)

    expect(RootClient.get).toBeCalledWith('/accounts/1234')
  })

  it('retains the account data on init', async () => {
    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockResolvedValueOnce({
      data: {
        name: 'Something',
        balance: 45.23
      }
    })

    await subject.dispatch('reconcileAccount', 1234)

    expect(subject.state.reconcile.account).toEqual({
      name: 'Something',
      balance: 45.23
    })
  })

  it('the action resolves when the account is loaded', async () => {
    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockResolvedValueOnce({
      data: {
        name: 'Something',
        balance: 45.23
      }
    })

    const status = await subject.dispatch('reconcileAccount', 1234)

    expect(status).toBeTruthy()
  })

  it('the action resolves when the account fails to load', async () => {
    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockRejectedValueOnce()

    const status = await subject.dispatch('reconcileAccount', 1234)

    expect(status).toBeFalsy()
  })
})