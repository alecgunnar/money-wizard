const AccountsRepository = require('../repositories/accounts')

module.exports = (router) => {
  router.post('/accounts', (req, res) => {
    const {name, type} = req.body

    if (typeof name === 'undefined') {
      return res.status(401).send({
        msg: 'A name is required.'
      })
    }

    if (name === '') {
      return res.status(401).send({
        msg: 'A non-empty name is required.'
      })
    }

    if (typeof type === 'undefined') {
      return res.status(401).send({
        msg: 'A type is required.'
      })
    }

    if (['asset', 'credit', 'loan'].indexOf(type) === -1) {
      return res.status(401).send({
        msg: 'The supplied type is not valid. Valid types are "asset" and "credit".'
      })
    }

    AccountsRepository.createAccount(name, type)
      .then(() => res.sendStatus(201))
      .catch(() => {
        res.status(500)
          .send({
            msg: 'Account creation failed for an unknown reason.'
          })
      })
  })
}