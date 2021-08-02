const router = require('express').Router()
const users = require('./users')
const transaction = require('./transaction')
const topup = require('./topup')
const transfer = require('./transfer')


router.use('/users', users)
router.use('/transaction', transaction)
router.use('/topup', topup)
router.use('/transfer', transfer)

module.exports = router