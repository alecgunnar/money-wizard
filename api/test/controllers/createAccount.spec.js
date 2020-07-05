const app = require('../../app')
const AccountsRepository = require('../../repositories/accounts')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')

chai.use(chaiHttp)

describe('Create Account Controller', () => {
  it('creates an asset account', () => {
    expect.assertions(2)

    AccountsRepository.createAccount.mockResolvedValueOnce()

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'asset'
      })
      .then((res) => {
        expect(AccountsRepository.createAccount).toBeCalledWith('Sample Account', 'asset')
        expect(res.statusCode).toBe(201)
      })
  })

  it('creates a credit account', () => {
    expect.assertions(2)

    AccountsRepository.createAccount.mockResolvedValueOnce()

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'credit'
      })
      .then((res) => {
        expect(AccountsRepository.createAccount).toBeCalledWith('Sample Account', 'credit')
        expect(res.statusCode).toBe(201)
      })
  })

  it('creates a loan account', () => {
    expect.assertions(2)

    AccountsRepository.createAccount.mockResolvedValueOnce()

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'loan'
      })
      .then((res) => {
        expect(AccountsRepository.createAccount).toBeCalledWith('Sample Account', 'loan')
        expect(res.statusCode).toBe(201)
      })
  })

  it('account creation fails', () => {
    expect.assertions(2)

    AccountsRepository.createAccount.mockRejectedValueOnce()

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'credit'
      })
      .then((res) => {
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({
          msg: 'Account creation failed for an unknown reason.'
        })
      })
  })

  it('does not create an account when a name is not supplied', () => {
    expect.assertions(3)

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        type: 'asset'
      })
      .then((res) => {
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
          msg: 'A name is required.'
        })

        expect(AccountsRepository.createAccount).not.toBeCalled()
      })
  })

  it('does not create an account when a the name is empty', () => {
    expect.assertions(3)

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: '',
        type: 'asset'
      })
      .then((res) => {
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
          msg: 'A non-empty name is required.'
        })

        expect(AccountsRepository.createAccount).not.toBeCalled()
      })
  })

  it('does not create an account when a type is not supplied', () => {
    expect.assertions(3)

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account'
      })
      .then((res) => {
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
          msg: 'A type is required.'
        })

        expect(AccountsRepository.createAccount).not.toBeCalled()
      })
  })

  it('does not create an account when type is invalid', () => {
    expect.assertions(3)

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'some unknown type'
      })
      .then((res) => {
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
          msg: 'The supplied type is not valid. Valid types are "asset" and "credit".'
        })

        expect(AccountsRepository.createAccount).not.toBeCalled()
      })
  })
})
