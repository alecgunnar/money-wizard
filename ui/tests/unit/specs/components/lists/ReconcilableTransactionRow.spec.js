import ReconcilableTransactionRow from '@/components/lists/ReconcilableTransactionRow'
import ReconcileModule from '@/store/reconcile'
import Vuex from 'vuex'
import {shallowMount, createLocalVue} from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

let togglePosted
let store

describe('Reconcilable Transaction Row', () => {
  beforeEach(() => {
    togglePosted = jest.fn()
    store = new Vuex.Store({
      modules: {
        reconcile: {
          ...ReconcileModule,
          actions: {
            ...ReconcileModule.actions,
            togglePosted
          }
        }
      }
    })
  })

  it('shows the amount for a debit transaction for a credit account', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'credit'
          },
          type: 'debit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
  })

  it('shows the amount for a credit transaction for a credit account', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'credit'
          },
          type: 'credit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$10.00')
  })

  it('shows the amount for a debit transaction for an asset account', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'asset'
          },
          type: 'debit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$10.00')
  })

  it('shows the amount for a credit transaction for an asset account', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'asset'
          },
          type: 'credit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
  })

  it('shows the amount for a debit transaction for a loan account', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'loan'
          },
          type: 'debit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('$10.00')
  })

  it('shows the amount for a credit transaction for a loan account', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=amount]').text()).toBe('-$10.00')
  })

  it('shows the reason', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.find('[data-qa=reason]').text()).toBe('just because')
  })

  it('utilizes class when posted', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 10,
          posted: true,
          reason: 'just because'
        }
      }
    })

    expect(subject.classes('posted')).toBeTruthy()
  })

  it('does not utilize class when not posted', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 10,
          posted: false,
          reason: 'just because'
        }
      }
    })

    expect(subject.classes('posted')).toBeFalsy()
  })

  it('clicking the posted indicator triggers the action', () => {
    const subject = shallowMount(ReconcilableTransactionRow, {
      store,
      localVue,
      propsData: {
        transaction: {
          id: 141,
          account: {
            type: 'loan'
          },
          type: 'credit',
          amount: 10,
          posted: false,
          reason: 'just because'
        }
      }
    })

    subject.find('[data-qa=posted-indicator]').trigger('click')

    expect(togglePosted).toBeCalledWith(expect.any(Object), 141)
  })
})