import transactions from '@/store/transactions'
import RootClient from '@/clients'
import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('@/clients')

const createSubject = (srvrErrMock = null) => {
  return new Vuex.Store({
    mutations: {
      encounteredServerError: srvrErrMock || jest.fn()
    },
    modules: {
      transactions
    }
  })
}

describe('transactions module', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('requests the account data on account init', () => {
    RootClient.get.mockResolvedValueOnce({
      name: 'Something',
      balance: 12.23
    })

    const subject = createSubject()
    subject.dispatch('forAccount', 2512)

    expect(RootClient.get).toBeCalledWith('/accounts/2512')
  })

  it('retains the accounts data on account init', async () => {
    expect.assertions(1)

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

    const subject = createSubject()
    await subject.dispatch('forAccount', 2512)

    expect(subject.state.transactions.account).toEqual(account)
  })

  it('retains the failure to load account on account init', async () => {
    expect.assertions(1)

    RootClient.get.mockRejectedValueOnce({
      err: 'msg'
    })

    const transactions = [
      {amount: 1.23, type: 'debit'}
    ]

    RootClient.get.mockResolvedValueOnce({
      data: transactions
    })

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    await subject.dispatch('forAccount', 2512)

    expect(srvrErrMock).toBeCalled()
  })

  it('resoves to false on failure to load account on account init', async () => {
    expect.assertions(1)

    RootClient.get.mockRejectedValueOnce({
      err: 'msg'
    })

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    const status = await subject.dispatch('forAccount', 2512)
    expect(status).toBeFalsy()
  })

  it('requests the transactions on account init', async () => {
    expect.assertions(1)

    const account = {
      name: 'Something',
      balance: 12.23
    }

    RootClient.get.mockResolvedValueOnce({
      data: account
    })

    const subject = createSubject()
    await subject.dispatch('forAccount', 1212)

    expect(RootClient.get).toBeCalledWith('/transactions?accountId=1212')
  })

  it('retains the transactions on account init', async () => {
    expect.assertions(1)

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

    const subject = createSubject()
    await subject.dispatch('forAccount', 1212)

    expect(subject.state.transactions.transactions).toEqual(transactions)
  })

  it('retains the failure to load transactions on account init', async () => {
    expect.assertions(1)

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

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    await subject.dispatch('forAccount', 2512)

    expect(srvrErrMock).toBeCalled()
  })

  it('resoves to false on failure to load transactions on account init', async () => {
    expect.assertions(1)

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

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    const status = await subject.dispatch('forAccount', 2512)

    expect(status).toBeFalsy()
  })

  it('resolves to true when all data is loaded on init', async () => {
    expect.assertions(1)

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

    const srvrErrMock = jest.fn()

    const subject = createSubject(srvrErrMock)
    const status = await subject.dispatch('forAccount', 2512)

    expect(status).toBeTruthy()
  })
})
