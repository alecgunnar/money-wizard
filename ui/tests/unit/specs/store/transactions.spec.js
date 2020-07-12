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
  it('makes a request to load transactions', () => {
    const fetchedTransactions = [
      {id: '123', reason: 'test'}
    ]

    RootClient.get.mockResolvedValueOnce({
      data: fetchedTransactions
    })

    const subject = createSubject()

    subject.dispatch('loadTransactions', 1234)

    expect(RootClient.get).toBeCalledWith('/transactions?accountId=1234')
  })

  it('stores the transactions that are loaded', async () => {
    expect.assertions(1)

    const fetchedTransactions = [
      {id: '123', reason: 'test'}
    ]

    RootClient.get.mockResolvedValueOnce({
      data: fetchedTransactions
    })

    const subject = createSubject()

    await subject.dispatch('loadTransactions', 1234)

    expect(subject.state.transactions.transactions).toEqual(fetchedTransactions)
  })

  it('stores error when loading transactions fails', async () => {
    RootClient.get.mockRejectedValueOnce({
      msg: 'err'
    })

    const srvrErrMock = jest.fn()
    const subject = createSubject(srvrErrMock)

    await subject.dispatch('loadTransactions', 1234)

    expect(srvrErrMock).toBeCalledWith(expect.any(Object), 'Could not load transactions.')
  })
})
