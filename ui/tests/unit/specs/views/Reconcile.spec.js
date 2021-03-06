import Reconcile from '@/views/Reconcile'
import ExpectedBalanceForm from '@/components/forms/ExpectedBalanceForm'
import ReconcilableTransactionsList from '@/components/lists/ReconcilableTransactionsList'
import ReconcileModule from '@/store/reconcile'
import Vuex from 'vuex'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

let store
let reconciledBalance
let reconcileAccount
let completeReconciliation

describe('Reconcile', () => {
  beforeEach(() => {
    reconciledBalance = jest.fn()
    reconcileAccount = jest.fn()
    completeReconciliation = jest.fn()

    reconciledBalance.mockReturnValueOnce(141)

    store = new Vuex.Store({
      modules: {
        reconcile: {
          ...ReconcileModule,
          getters: {
            ...ReconcileModule.getters,
            reconciledBalance
          },
          actions: {
            ...ReconcileModule.actions,
            reconcileAccount,
            completeReconciliation
          }
        }
      }
    })
  })

  afterEach(() => {
    store.commit('reconcile/reset')
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

  it('renders the expected balance', async () => {
    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account'
    })

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
    expect(subject.find('[data-qa=expected-balance]').text()).toBe('$10.99')
  })

  it('does not render an expected balance before one is entered', async () => {
    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()

    expect(subject.find('[data-qa=expected-balance]').text()).toBe('$0.00')
  })

  it('renders the account name', async () => {
    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()

    expect(subject.find('[data-qa=account-name]').text()).toBe('Sample Account')
  })

  it('the name is not rendered before the account data is loaded', () => {
    store.commit('reconcile/reset')

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    expect(subject.find('[data-qa=account-name]').exists()).toBeFalsy()
  })

  it('shows the reconciled balance', async () => {
    jest.resetAllMocks()
    reconciledBalance.mockReturnValueOnce(91.41)

    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

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

    expect(subject.find('[data-qa=reconciled-balance]').text()).toBe('$91.41')
  })

  it('does not show the reconciled balance before account data is loaded', async () => {
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    expect(subject.find('[data-qa=reconciled-balance]').exists()).toBeFalsy()
  })

  it('renders the difference between the expected and the reconciled balances', async () => {
    jest.resetAllMocks()
    reconciledBalance.mockReturnValueOnce(4.75)

    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

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

    expect(subject.find('[data-qa=balance-difference]').text()).toBe('-$6.24')
  })

  it('does not render the difference between the expected and the reconciled balances before an expected balance has been entered', async () => {
    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()

    expect(subject.find('[data-qa=balance-difference]').text()).toBe('$0.00')
  })

  it('has a transactions list', () => {
    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    expect(subject.findComponent(ReconcilableTransactionsList).exists()).toBeTruthy()
  })

  it('props the transactions to the list', () => {
    store.commit('reconcile/transactionsLoaded', [
      {
        type: 'debit',
        amount: 123
      },
      {
        type: 'credit',
        amount: 456
      }
    ])

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    expect(subject.findComponent(ReconcilableTransactionsList).props('transactions')).toEqual([
      expect.objectContaining({
        type: 'debit',
        amount: 123
      }),
      expect.objectContaining({
        type: 'credit',
        amount: 456
      })
    ])
  })

  it('once the balance difference is zero a submit button appears', async () => {
    jest.resetAllMocks()
    reconciledBalance.mockReturnValueOnce(4.13)

    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()
    subject.findComponent(ExpectedBalanceForm).vm.$emit('submitted', 4.13)
    await subject.vm.$nextTick()

    expect(subject.find('[data-qa=submit-reconciliation]').exists()).toBeTruthy()
  })

  it('the submit button does not appear if the balances are not the same', async () => {
    jest.resetAllMocks()
    reconciledBalance.mockReturnValueOnce(4.75)

    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()
    subject.findComponent(ExpectedBalanceForm).vm.$emit('submitted', 14.21)
    await subject.vm.$nextTick()

    expect(subject.find('[data-qa=submit-reconciliation]').exists()).toBeFalsy()
  })

  it('the action is triggered when the reconciliation is submitted', async () => {
    jest.resetAllMocks()
    reconciledBalance.mockReturnValueOnce(4.13)

    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()
    subject.findComponent(ExpectedBalanceForm).vm.$emit('submitted', 4.13)
    await subject.vm.$nextTick()

    completeReconciliation.mockRejectedValueOnce()

    subject.find('[data-qa=submit-reconciliation]').trigger('click')

    expect(completeReconciliation).toBeCalled()
  })

  it('the user is redirected when the reconciliation is complete', async () => {
    jest.resetAllMocks()
    reconciledBalance.mockReturnValueOnce(4.13)

    store.commit('reconcile/accountLoaded', {
      name: 'Sample Account',
      balance: 4.13
    })

    const push = jest.fn()

    const subject = shallowMount(Reconcile, {
      store,
      localVue,
      propsData: {
        id: 1234
      },
      mocks: {
        $router: {
          push
        }
      }
    })

    reconcileAccount.mockResolvedValueOnce(true)
    await subject.vm.$nextTick()
    subject.findComponent(ExpectedBalanceForm).vm.$emit('submitted', 4.13)
    await subject.vm.$nextTick()

    completeReconciliation.mockResolvedValueOnce()

    subject.find('[data-qa=submit-reconciliation]').trigger('click')
    await subject.vm.$nextTick()

    expect(push).toBeCalledWith({
      name: 'account',
      params: {
        id: 1234
      }
    })
  })
})