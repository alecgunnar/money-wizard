const AccountsRepository = require('../../repositories/accounts')
const ReconciliationsRepository = require('../../repositories/reconciliations')

describe('Reconciliations Repository', () => {
  it('creates the reconciliation', async () => {
    const accountId = await AccountsRepository.createAccount('sample', 'asset')
    const reconciliationId = await ReconciliationsRepository.createReconciliation(accountId, 34.11, '2020-07-06')
    return expect(
      ReconciliationsRepository.getReconciliation(reconciliationId)
    ).resolves.toEqual({
      id: reconciliationId,
      balance: 34.11,
      completed: '2020-07-06'
    })
  })

  it('retrieves the most recent reconciliation for an account', async () => {
    const accountId = await AccountsRepository.createAccount('sample', 'asset')

    await ReconciliationsRepository.createReconciliation(accountId, 54.13, '2020-07-05')
    const mostRecent = await ReconciliationsRepository.createReconciliation(accountId, 34.11, '2020-07-06')

    return expect(
      ReconciliationsRepository.getLatestReconciliationForAccount(accountId)
    ).resolves.toEqual({
      id: mostRecent,
      balance: 34.11,
      completed: '2020-07-06'
    })
  })

  it('returns null when no reconciliation exists for an account', async () => {
    const accountId = await AccountsRepository.createAccount('sample', 'asset')

    return expect(
      ReconciliationsRepository.getLatestReconciliationForAccount(accountId)
    ).resolves.toBeNull()
  })
})
