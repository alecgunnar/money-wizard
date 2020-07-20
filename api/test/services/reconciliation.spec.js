const ReconciliationService = require('../../services/reconciliation')
const BalancesService = require('../../services/balances')
const ReconciliationsRepository = require('../../repositories/reconciliations')
const TransactionsRepository = require('../../repositories/transactions')
const moment = require('moment')

jest.mock('../../services/balances')
jest.mock('../../repositories/reconciliations')
jest.mock('../../repositories/transactions')

describe('Reconciliation Service', () => {
  it('creates the reconciliation', async () => {
    expect.assertions(1)
    BalancesService.getReconciledBalance.mockResolvedValueOnce(0)
    ReconciliationsRepository.createReconciliation.mockResolvedValueOnce(123)
    await ReconciliationService.reconcileAccount({id: 10, type: 'asset'}, [{id: 11, amount: 11, type: 'credit'}, {id: 52, amount: 52, type: 'credit'}])
    expect(ReconciliationsRepository.createReconciliation).toBeCalledWith(10, 63, moment().format('YYYY-MM-DD'))
  })

  it('creates the reconciliation with the carryover balance', async () => {
    expect.assertions(1)
    BalancesService.getReconciledBalance.mockResolvedValueOnce(10)
    ReconciliationsRepository.createReconciliation.mockResolvedValueOnce(123)
    await ReconciliationService.reconcileAccount({id: 10, type: 'asset'}, [{id: 11, amount: 11, type: 'credit'}, {id: 52, amount: 52, type: 'credit'}])
    expect(ReconciliationsRepository.createReconciliation).toBeCalledWith(10, 73, moment().format('YYYY-MM-DD'))
  })

  it('updates each transaction with the reconciliation', async () => {
    expect.assertions(2)
    BalancesService.getReconciledBalance.mockResolvedValueOnce(0)
    ReconciliationsRepository.createReconciliation.mockResolvedValueOnce(123)
    await ReconciliationService.reconcileAccount({id: 10, type: 'asset'}, [{id: 11, amount: 11, type: 'credit'}, {id: 52, amount: 52, type: 'credit'}])
    expect(TransactionsRepository.updateReconciliation).toBeCalledWith(11, 123)
    expect(TransactionsRepository.updateReconciliation).toBeCalledWith(52, 123)
  })
})
