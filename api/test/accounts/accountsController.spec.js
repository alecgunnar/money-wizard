const app = require('../../app')
const repo = require('../../src/accounts/repository')
const chai = require('chai')
const chaiHttp = require('chai-http')

jest.mock('../../src/accounts/repository')

chai.use(chaiHttp)

describe('Accounts Controller', () => {
  it('creates an asset account', () => {
    expect.assertions(2)

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'asset'
      })
      .then((res) => {
        expect(res.statusCode).toBe(201)
        expect(repo.createAccount).toBeCalledWith('Sample Account', 'asset')
      })
  })

  it('creates a credit account', () => {
    expect.assertions(2)

    return chai.request(app)
      .post('/accounts')
      .set('content-type', 'application/json')
      .send({
        name: 'Sample Account',
        type: 'credit'
      })
      .then((res) => {
        expect(res.statusCode).toBe(201)
        expect(repo.createAccount).toBeCalledWith('Sample Account', 'credit')
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
          msg: 'A name is required'
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
          msg: 'A type is required'
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

    repo.getAccounts.mockReturnValueOnce(accounts)

    expect.assertions(3)

    return chai.request(app)
      .get('/accounts')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(repo.getAccounts).toBeCalled()
        expect(res.body).toEqual(accounts)
      })
  })
})
