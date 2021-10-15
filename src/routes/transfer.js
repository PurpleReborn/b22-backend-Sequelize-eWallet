const transfer = require('express').Router()
const { createTransfer,getTransferByIdSender,getTransferByIdRecipient } = require('../controllers/transfer')
const auth = require('../middlewares/auth')

transfer.get('/HistoryRecipient', auth, getTransferByIdRecipient)
transfer.get('/historySender', auth, getTransferByIdSender)
transfer.post('/',auth, createTransfer)

module.exports = transfer