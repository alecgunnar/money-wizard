const ReconciliationService = require('../../services/reconciliation')
const ReconciliationsRepository = require('../../repositories/reconciliations')
const TransactionsRepository = require('../../repositories/transactions')
const moment = require('moment')

jest.mock('../../repositories/reconciliations')
jest.mock('../../repositories/transactions')

describe('Reconciliation Service', () => {
  it('creates the reconciliation', () => {
    ReconciliationsRepository.createReconciliation.mockResolvedValueOnce(123)
    ReconciliationService.reconcileAccount({id: 10}, 54.21, [{id: 11}, {id: 52}])
    expect(ReconciliationsRepository.createReconciliation).toBeCalledWith(10, 54.21, moment().format('YYYY-MM-DD'))
  })

  it('updates each transaction with the reconciliation', async () => {
    ReconciliationsRepository.createReconciliation.mockResolvedValueOnce(123)
    await ReconciliationService.reconcileAccount({id: 10}, 54.21, [{id: 11}, {id: 52}])
    expect(TransactionsRepository.updateReconciliation).toBeCalledWith(11, 123)
    expect(TransactionsRepository.updateReconciliation).toBeCalledWith(52, 123)
  })
})
