const transactionsService = require('../../services/transactions')
const transactionsRepository = require('../../repositories/transactions')

jest.mock('../../repositories/transactions')

describe('transactions service', () => {
  it('fetches all transactions for the account', () => {
    transactionsRepository.getTransactionsForAccount.mockResolvedValueOnce([])
    transactionsService.getTransactionsForAccount(51)
    expect(transactionsRepository.getTransactionsForAccount).toBeCalledWith(51)
  })

  it('groups the transactions for the account by date', () => {
    transactionsRepository.getTransactionsForAccount.mockResolvedValueOnce([
      {
        date: '2020-05-28',
        amount: 10.79
      },
      {
        date: '2020-05-28',
        amount: 19.94
      },
      {
        date: '2020-06-26',
        amount: 19.68
      }
    ])

    const result = transactionsService.getTransactionsForAccount(51)

    return expect(result).resolves.toEqual({
      '2020-05-28': [
        {
          date: '2020-05-28',
          amount: 10.79
        },
        {
          date: '2020-05-28',
          amount: 19.94
        }
      ],
      '2020-06-26': [
        {
          date: '2020-06-26',
          amount: 19.68
        }
      ]
    })
  })

  it('sorts transaction groups by date', async () => {
    transactionsRepository.getTransactionsForAccount.mockResolvedValueOnce([
      {
        date: '2020-06-26',
        amount: 19.68
      },
      {
        date: '2020-05-28',
        amount: 10.79
      },
      {
        date: '2020-05-28',
        amount: 19.94
      }
    ])

    const result = await transactionsService.getTransactionsForAccount(51)

    expect(
      Object.keys(result)
    ).toEqual(['2020-05-28', '2020-06-26'])
  })

  it('does not group the transactions for the account when inline flag is set', () => {
    transactionsRepository.getTransactionsForAccount.mockResolvedValueOnce([
      {
        date: '2020-05-28',
        amount: 10.79
      },
      {
        date: '2020-05-28',
        amount: 19.94
      },
      {
        date: '2020-06-26',
        amount: 19.68
      }
    ])

    const result = transactionsService.getTransactionsForAccount(51, true)

    return expect(result).resolves.toEqual([
      {
        date: '2020-05-28',
        amount: 10.79
      },
      {
        date: '2020-05-28',
        amount: 19.94
      },
      {
        date: '2020-06-26',
        amount: 19.68
      }
    ])
  })
})
