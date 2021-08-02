const transaction = require('express').Router()
const { createTransaction, detailTransaction} = require('../controllers/transaction')
const auth = require('../middlewares/auth')

transaction.get('/:id', detailTransaction)
transaction.post('/',auth, createTransaction)



module.exports = transaction