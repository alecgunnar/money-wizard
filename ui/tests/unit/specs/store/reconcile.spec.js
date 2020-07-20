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

  it('retains the account balance on init', async () => {
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

    expect(subject.state.reconcile.balance).toEqual(45.23)
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

    expect(RootClient.get).toBeCalledWith('/transactions?accountId=4521&reconciled=false&inline=true')
  })

  it('records the transactions that are loaded', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          account: {
            type: 'asset'
          },
          type: 'debit',
          amount: 10
        },
        {
          account: {
            type: 'asset'
          },
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

    expect(subject.state.reconcile.transactions).toMatchObject([
      {
        account: {
          type: 'asset'
        },
        type: 'debit',
        amount: 10,
        posted: true
      },
      {
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 14,
        posted: true
      }
    ])
  })

  it('toggles the posted state of the transaction from posted to not posted', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 422,
          account: {
            type: 'asset'
          },
          type: 'debit',
          amount: 10
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
    await subject.dispatch('reconcile/togglePosted', 422)

    expect(subject.state.reconcile.transactions).toMatchObject([
      {
        posted: false
      }
    ])
  })

  it('toggles the posted state of the transaction from not posted to posted', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 422,
          account: {
            type: 'asset'
          },
          type: 'debit',
          amount: 10
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
    await subject.dispatch('reconcile/togglePosted', 422)
    await subject.dispatch('reconcile/togglePosted', 422)

    expect(subject.state.reconcile.transactions).toMatchObject([
      {
        posted: true
      }
    ])
  })

  it('calculates the reconciled balance for an asset account', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          account: {
            type: 'asset'
          },
          type: 'debit',
          amount: 10
        },
        {
          id: 2,
          account: {
            type: 'asset'
          },
          type: 'credit',
          amount: 14
        },
        {
          id: 3,
          account: {
            type: 'asset'
          },
          type: 'credit',
          amount: 28
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

    subject.commit('reconcile/accountLoaded', {
      id: 1234,
      reconciledBalance: 0
    })

    await subject.dispatch('reconcile/loadTransactions', 4521)
    await subject.dispatch('reconcile/togglePosted', 2)

    expect(subject.getters['reconcile/reconciledBalance']).toBe(18)
  })

  it('calculates the reconciled balance for a credit account', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          account: {
            type: 'credit'
          },
          type: 'debit',
          amount: 10
        },
        {
          id: 2,
          account: {
            type: 'credit'
          },
          type: 'credit',
          amount: 14
        },
        {
          id: 3,
          account: {
            type: 'credit'
          },
          type: 'credit',
          amount: 28
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
    await subject.dispatch('reconcile/togglePosted', 2)

    expect(subject.getters['reconcile/reconciledBalance']).toBe(-18)
  })

  it('calculates the reconciled balance for a loan account', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          account: {
            type: 'loan'
          },
          type: 'debit',
          amount: 10
        },
        {
          id: 2,
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 14
        },
        {
          id: 3,
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 28
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
    await subject.dispatch('reconcile/togglePosted', 2)

    expect(subject.getters['reconcile/reconciledBalance']).toBe(-18)
  })

  it('calculates the reconciled balance up to two decimal places', async () => {
    RootClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          account: {
            type: 'loan'
          },
          type: 'debit',
          amount: 10.31214125
        },
        {
          id: 2,
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 14.2351212
        },
        {
          id: 3,
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 28.2351245
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

    expect(subject.getters['reconcile/reconciledBalance']).toBe(-32.16)
  })

  it('makes a request to complete the reconciliation', async () => {
    RootClient.post.mockResolvedValueOnce()

    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    subject.commit('reconcile/accountLoaded', {
      id: 1234
    })

    subject.commit('reconcile/transactionsLoaded', [
      {
        id: 1,
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 10
      },
      {
        id: 2,
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 14
      }
    ])

    await subject.dispatch('reconcile/togglePosted', 2)

    subject.dispatch('reconcile/completeReconciliation')
    expect(RootClient.post).toBeCalledWith('/accounts/1234/reconcile', {
      transactions: [1]
    })
  })

  it('resolves when the reconciliation request resolves', async () => {
    RootClient.post.mockResolvedValueOnce()

    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    subject.commit('reconcile/accountLoaded', {
      id: 1234
    })

    subject.commit('reconcile/transactionsLoaded', [
      {
        id: 1,
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 10
      },
      {
        id: 2,
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 14
      }
    ])

    return expect(
      subject.dispatch('reconcile/completeReconciliation')
    ).resolves.toBeUndefined()
  })

  it('rejects when the reconciliation request fails', async () => {
    RootClient.post.mockRejectedValueOnce()

    const subject = new Vuex.Store({
      modules: {
        reconcile: ReconcileModule
      }
    })

    subject.commit('reconcile/accountLoaded', {
      id: 1234
    })

    subject.commit('reconcile/transactionsLoaded', [
      {
        id: 1,
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 10
      },
      {
        id: 2,
        account: {
          type: 'asset'
        },
        type: 'credit',
        amount: 14
      }
    ])

    return expect(
      subject.dispatch('reconcile/completeReconciliation')
    ).rejects.toBeUndefined()
  })
})