const TopUpModel = require('../models/topup')
const UserModel = require('../models/users')
const { Op } = require('sequelize')

exports.createTopUp = async (req, res) => {
  if (typeof req.body.deductedBalance === 'string') {
    req.body.deductedBalance = parseInt(req.body.deductedBalance)
  }
  if (req.body.deductedBalance < 0) {
    return res.json({
      success: false,
      message: 'your balance is not enough'
    })
  }
  if (req.body.deductedBalance < 10000) {
    return res.json({
      success: false,
      message: 'minimum topup 10.000'
    })
  }
  const user = await UserModel.findByPk(req.authUser.id)
  console.log(user)
  const create = await TopUpModel.create(req.body)
    
  // {
  //   userId: req.authUser.id,
  //   refNo: date.getTime(),
  //   deductedBalance: req.body.deductedBalance,
  //   description: desc,
  //   trxFee: req.body.trxFee
  // })
  // user.increment('balance', { by: req.body.deductedBalance})
  const amount = req.body.deductedBalance
  user.set('balance', user.balance + amount)
  await user.save()
  return res.json({
    success: true,
    message: 'Top Up successfully',
    results: create
  })
}

exports.getTopUp = async (req, res) => {
  const {userId} = req.params
  const trx = await TopUpModel.findAll({
    where: {
      userId: {
        [Op.substring]: userId
      }
    },
    include: [
      {model: UserModel, as: 'detail'}
    ]
  })
  return res.json({
    success: true,
    message: 'TopUp History',
    results: trx
  })
}