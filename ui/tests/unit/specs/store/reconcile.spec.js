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
      mutations: {
        encounteredServerError: jest.fn()
      },
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockResolvedValueOnce({
      data: {}
    })

    subject.dispatch('reconcile/reconcileAccount', 1234)

    expect(RootClient.get).toBeCalledWith('/accounts/1234')
  })

  it('retains the account data on init', async () => {
    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError: jest.fn()
      },
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

    await subject.dispatch('reconcile/reconcileAccount', 1234)

    expect(subject.state.reconcile.account).toEqual({
      name: 'Something',
      balance: 45.23
    })
  })

  it('the action resolves when the account is loaded', async () => {
    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError: jest.fn()
      },
      modules: {
        reconcile: {
          ...ReconcileModule,
          actions: {
            ...ReconcileModule.actions,
            loadTransactions: jest.fn()
          }
        }
      }
    })

    RootClient.get.mockResolvedValueOnce({
      data: {
        name: 'Something',
        balance: 45.23
      }
    })

    const status = await subject.dispatch('reconcile/reconcileAccount', 1234)

    expect(status).toBeTruthy()
  })

  it('transactions are loaded once the account has been loaded', async () => {
    const loadTransactions = jest.fn()

    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError: jest.fn()
      },
      modules: {
        reconcile: {
          ...ReconcileModule,
          actions: {
            ...ReconcileModule.actions,
            loadTransactions
          }
        }
      }
    })

    RootClient.get.mockResolvedValueOnce({
      data: {
        name: 'Something',
        balance: 45.23
      }
    })

    await subject.dispatch('reconcile/reconcileAccount', 1234)

    expect(loadTransactions).toBeCalledWith(expect.any(Object), 1234)
  })

  it('the action resolves when the account fails to load', async () => {
    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError: jest.fn()
      },
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockRejectedValueOnce()

    const status = await subject.dispatch('reconcile/reconcileAccount', 1234)

    expect(status).toBeFalsy()
  })

  it('records the error when the account fails to load', async () => {
    const encounteredServerError = jest.fn()

    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError
      },
      modules: {
        reconcile: ReconcileModule
      }
    })

    RootClient.get.mockRejectedValueOnce()

    await subject.dispatch('reconcile/reconcileAccount', 1234)

    expect(encounteredServerError).toBeCalled()
  })

  it('makes a call to load transactons when actioned', () => {
    RootClient.get.mockResolvedValueOnce([])
    
    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError: jest.fn()
      },
      modules: {
        reconcile: ReconcileModule
      }
    })

    subject.dispatch('reconcile/loadTransactions', 4521)

    expect(RootClient.get).toBeCalledWith('/transactions?accountId=4521&reconciled=false')
  })

  it('records the transactions that are loaded', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          type: 'debit',
          amount: 10
        },
        {
          type: 'credit',
          amount: 14
        }
      ]
    })

    const subject = new Vuex.Store({
      mutations: {
        encounteredServerError: jest.fn()
      },
      modules: {
        reconcile: ReconcileModule
      }
    })

    await subject.dispatch('reconcile/loadTransactions', 4521)

    expect(subject.state.reconcile.transactions).toEqual([
      {
        type: 'debit',
        amount: 10
      },
      {
        type: 'credit',
        amount: 14
      }
    ])
  })
})