import transactions from '@/store/transactions'
import RootClient from '@/clients'
import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('@/clients')

const createSubject = (srvrErrMock = null, rldAcct = null) => {
  return new Vuex.Store({
    mutations: {
      encounteredServerError: srvrErrMock || jest.fn()
    },
    modules: {
      transactions: {
        ...transactions,
        actions: {
          ...transactions.actions,
          reloadAccount: rldAcct || transactions.actions.reloadAccount
        }
      }
    }
  })
}

describe('transactions module', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('retains the account id on init', () => {
    const subject = createSubject()
    subject.dispatch('forAccount', 1242)

    expect(subject.state.transactions.accountId).toBe(1242)
  })

  it('loads the account data on init', () => {
    const ldAcct = jest.fn()
    const subject = createSubject(null, ldAcct)
    subject.dispatch('forAccount', 1242)

    expect(ldAcct).toBeCalled()
  })

  it('resolves to true when account data loads on init', async () => {
    expect.assertions(1)
    const ldAcct = jest.fn()
    ldAcct.mockResolvedValueOnce(true)
    const subject = createSubject(null, ldAcct)
    const status = await subject.dispatch('forAccount', 1242)
    expect(status).toBeTruthy()
  })

  it('resolves to false when account data fails to load on init', async () => {
    expect.assertions(1)
    const ldAcct = jest.fn()
    ldAcct.mockResolvedValueOnce(false)
    const subject = createSubject(null, ldAcct)
    const status = await subject.dispatch('forAccount', 1242)
    expect(status).toBeFalsy()
  })

  it('requests the account data on reload account', () => {
    RootClient.get.mockResolvedValueOnce({
      name: 'Something',
      balance: 12.23
    })

    const subject = createSubject()
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()
    subject.dispatch('reloadAccount')

    expect(RootClient.get).toBeCalledWith('/accounts/2512')
  })

  it('retains the accounts data on reload account', async () => {
    expect.assertions(1)

    const subject = createSubject()
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()

    const account = {
      name: 'Something',
      balance: 12.23
    }

    RootClient.get.mockResolvedValueOnce({
      data: account
    })

    const transactions = [
      {amount: 1.23, type: 'debit'}
    ]

    RootClient.get.mockResolvedValueOnce({
      data: transactions
    })

    await subject.dispatch('reloadAccount')

    expect(subject.state.transactions.account).toEqual(account)
  })

  it('retains the failure to load account on reload account', async () => {
    expect.assertions(1)

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()

    RootClient.get.mockRejectedValueOnce({
      err: 'msg'
    })

    const transactions = [
      {amount: 1.23, type: 'debit'}
    ]

    RootClient.get.mockResolvedValueOnce({
      data: transactions
    })

    await subject.dispatch('reloadAccount')

    expect(srvrErrMock).toBeCalled()
  })

  it('resoves to false on failure to load account on reload account', async () => {
    expect.assertions(1)

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()

    RootClient.get.mockRejectedValueOnce({
      err: 'msg'
    })

    const status = await subject.dispatch('reloadAccount')
    expect(status).toBeFalsy()
  })

  it('requests the transactions on reload account', async () => {
    expect.assertions(1)

    const subject = createSubject()
    subject.dispatch('forAccount', 1212)
    jest.resetAllMocks()

    const account = {
      name: 'Something',
      balance: 12.23
    }

    RootClient.get.mockResolvedValueOnce({
      data: account
    })

    await subject.dispatch('reloadAccount')

    expect(RootClient.get).toBeCalledWith('/transactions?accountId=1212')
  })

  it('retains the transactions on reload account', async () => {
    expect.assertions(1)

    const subject = createSubject()
    jest.resetAllMocks()

    const account = {
      name: 'Something',
      balance: 12.23
    }

    const transactions = [
      {amount: 1.23, type: 'debit'}
    ]

    RootClient.get
      .mockResolvedValueOnce({
        data: account
      })
      .mockResolvedValueOnce({
        data: transactions
      })

    await subject.dispatch('forAccount', 1212)

    expect(subject.state.transactions.transactions).toEqual(transactions)
  })

  it('retains the failure to load transactions on reload account', async () => {
    expect.assertions(1)

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()

    const account = {
      name: 'Something',
      balance: 12.23
    }

    RootClient.get.mockResolvedValueOnce({
      data: account
    })

    RootClient.get.mockRejectedValueOnce({
      err: 'msg'
    })

    await subject.dispatch('reloadAccount')

    expect(srvrErrMock).toBeCalled()
  })

  it('resoves to false on failure to load transactions on reload account', async () => {
    expect.assertions(1)

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()

    const account = {
      name: 'Something',
      balance: 12.23
    }

    RootClient.get.mockResolvedValueOnce({
      data: account
    })

    RootClient.get.mockRejectedValueOnce({
      err: 'msg'
    })

    const status = await subject.dispatch('reloadAccount')

    expect(status).toBeFalsy()
  })

  it('resolves to true when all data is loaded on init', async () => {
    expect.assertions(1)

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    subject.dispatch('forAccount', 2512)
    jest.resetAllMocks()

    const account = {
      name: 'Something',
      balance: 12.23
    }

    const transactions = [
      {amount: 1.23, type: 'debit'}
    ]

    RootClient.get
      .mockResolvedValueOnce({
        data: account
      })
      .mockResolvedValueOnce({
        data: transactions
      })

    const status = await subject.dispatch('reloadAccount')

    expect(status).toBeTruthy()
  })
})
