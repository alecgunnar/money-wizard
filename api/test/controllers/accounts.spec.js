const app = require('../../app')
const repo = require('../../repositories/accounts')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../repositories/accounts')

chai.use(chaiHttp)

describe('Accounts Controller', () => {
  it('creates an asset account', () => {
    expect.assertions(2)

    repo.createAccount.mockResolvedValueOnce()

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'asset'
      })
      .then((res) => {
        expect(repo.createAccount).toBeCalledWith('Sample Account', 'asset')
        expect(res.statusCode).toBe(201)
      })
  })

  it('creates a credit account', () => {
    expect.assertions(2)

    repo.createAccount.mockResolvedValueOnce()

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'credit'
      })
      .then((res) => {
        expect(repo.createAccount).toBeCalledWith('Sample Account', 'credit')
        expect(res.statusCode).toBe(201)
      })
  })

  it('account creation fails', () => {
    expect.assertions(2)

    repo.createAccount.mockRejectedValueOnce()

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

        expect(repo.createAccount).not.toBeCalled()
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

        expect(repo.createAccount).not.toBeCalled()
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

        expect(repo.createAccount).not.toBeCalled()
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

        expect(repo.createAccount).not.toBeCalled()
      })
  })

  it('retrieves all of the accounts', () => {
    const accounts = [
      {
        name: 'Sample Account',
        type: 'asset'
      }
    ]

    repo.getAccounts.mockResolvedValueOnce(accounts)

    expect.assertions(3)

    return chai.request(app)
      .get('/accounts')
      .then((res) => {
        expect(repo.getAccounts).toBeCalled()
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(accounts)
      })
  })

  it('fails to retrieve all of the accounts', () => {
    repo.getAccounts.mockRejectedValueOnce()

    expect.assertions(3)

    return chai.request(app)
      .get('/accounts')
      .then((res) => {
        expect(repo.getAccounts).toBeCalled()
        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({
          msg: 'Could not retrieve all accounts for an unknown reason.'
        })
      })
  })
})
