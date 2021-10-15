const  Transaction  = require('../models/transaction')
const UserModel = require('../models/users')

exports.createTransaction = async(req, res) =>{
  const user = await UserModel.findByPk(req.authUser.id)
  if (typeof req.body.deductedBalance === 'string') {
    req.body.deductedBalance = parseInt(req.body.deductedBalance)
  }
  if (typeof req.body.trxFee === 'string') {
    req.body.trxFee = parseInt(req.body.trxFee)
  }
  if(req.body.deductedBalance < 5000){
    return res.status(401).json({
      success: false,
      message: 'mininum transfer 5.000'
    })
  }
  if(req.body.deductedBalance > user.balance){
    return res.status(401).json({
      success: false,
      message: 'Not enough balance'
    })
  }
  const trx = await Transaction.create(req.body)
  const decr = req.body.deductedBalance
  const fee = req.body.trxFee
  if(req.body.trxFee){
    const total = decr + fee
    user.set('balance', user.balance - total)
  }else{
    user.set('balance', user.balance - decr)
  }

  await user.save()
  return res.json({
    success: true,
    message: 'Transaction successfully',
    results: trx
  })
}

exports.detailTransaction = async(req, res)=>{
  const {id} = req.params
  const trx = await Transaction.findByPk(id, {
    include: [
      {model: UserModel, as: 'TrxDetail'}
    ]
  })
  return res.json({
    success: true,
    message: 'Detail Transaction',
    results: trx
  })
}