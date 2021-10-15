
const topup = require('express').Router()
const { createTopUp,getTopUp } = require('../controllers/topup')
const auth = require('../middlewares/auth')

topup.get('/:userId', getTopUp)
topup.post('/', auth, createTopUp)


module.exports = topup