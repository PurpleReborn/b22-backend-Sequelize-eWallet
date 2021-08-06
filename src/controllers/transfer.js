const TransferModel = require('../models/transfer')
const UserModel = require('../models/users')
const TokenFCM = require('../models/tokenFCM')
// const firebase = require('../helpers/firebase')
// const { Op } = require('sequelize')

exports.createTransfer = async (req, res) => {
  const userDetailRecipient = await UserModel.findOne({
    where: {
      phone: req.body.phoneNumberRecipient
    },
    include: TokenFCM
  })
  if(userDetailRecipient === null){
      return res.status(404).json({
      success: false,
      message: 'User Not Found'
    })
  }
  // const userDetailRecipient = await UserModel.findOne({
  //   where: {
  //     phone: req.body.phoneNumberRecipient
  //   }
  // })
  if(userDetailRecipient === null){
      return res.status(404).json({
      success: false,
      message: 'User Not Found'
    })
  }
  const {id} = req.authUser;
  const userRecipient = await UserModel.findByPk(userDetailRecipient.id)
  const userSender = await UserModel.findByPk(id)
  if (typeof req.body.deductedBalance === 'string') {
    req.body.deductedBalance = parseInt(req.body.deductedBalance)
  }
  if (typeof req.body.trxFee === 'string') {
    req.body.trxFee = parseInt(req.body.trxFee)
  }
  if (userRecipient) {
    if(req.body.deductedBalance > userSender.balance){
      return res.status(401).json({
        success: false,
        message: 'Not enough balance'
      })
    }
    const data = {
      ...req.body,
      trxFee: 0,
      userIdRecipient: `${userDetailRecipient.id}`,
      userIdSender: id
    }
    const totalForRecipient = req.body.deductedBalance
    const totalForSender = req.body.deductedBalance + data.trxFee
    userRecipient.set('balance', userRecipient.balance + totalForRecipient)
    await userRecipient.save()
    userSender.set('balance', userSender.balance - totalForSender)
    await userSender.save()
    const trx = await TransferModel.create(data)

    
      // firebase.messaging().sendToDevice(userDetailRecipient.token_fcm.token, {
      //   notification: {
      //     title: 'OVO',
      //     body: `${userSender.name} transfer saldo sebesar ${Number(req.body.deductedBalance).toLocaleString('en')} melalui aplikasi OVO`
      //   }
      // })
    

    return res.json({
      success: true,
      message: 'Transfer successfully',
      results: trx
    })
  } else {
    return res.status(404).json({
      success: false,
      message: 'User Not Found'
    })
  }
}

exports.getTransferByIdSender = async (req, res) => {
  const {id : userIdSender} = req.authUser;
  let {sort = 'ASC', limit = 7, page = 1 } = req.query
  let order = []
  if (typeof sort === 'object') {
    const key = Object.keys(sort)[0]
    let value = sort[key]
    if (value === '1') {
      value = 'DESC'
    } else {
      value = 'ASC'
    }
    order.push([key, value])
  }
  if (typeof limit === 'string') {
    limit = parseInt(limit)
  }
  if (typeof page === 'string') {
    page = parseInt(page)
  }
  const trx = await TransferModel.findAll({
    where: {
      userIdSender: userIdSender
    },
    include: [
      { model: UserModel, as: 'userDetailSender' },
      { model: UserModel, as: 'userDetailRecipient' }
    ],
    order,
    limit,
    offset: (page - 1) * limit
  })
  if (trx.length > 0) {
    const count = await TransferModel.count({
      where: {
        userIdSender: userIdSender
      }
    })
    trx.map(value => {
      value.deductedBalance = Number(value.deductedBalance).toLocaleString('en')
    })
    return res.json({
      success: true,
      message: 'History Transfer by sender',
      results: trx,
      pageInfo: {
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        limitData: limit
      }
    })
  } else {
    return res.status(404).json({
      success: false,
      message: 'User Not Found'
    })
  }
}

exports.getTransferByIdRecipient = async (req, res) => {
  const {id : userIdRecipient} = req.authUser;
  let {sort = 'ASC', limit = 7, page = 1 } = req.query
  let order = []
  if (typeof sort === 'object') {
    const key = Object.keys(sort)[0]
    let value = sort[key]
    if (value === '1') {
      value = 'DESC'
    } else {
      value = 'ASC'
    }
    order.push([key, value])
  }
  if (typeof limit === 'string') {
    limit = parseInt(limit)
  }
  if (typeof page === 'string') {
    page = parseInt(page)
  }
  const trx = await TransferModel.findAll({
    where: {
      userIdRecipient: userIdRecipient
    },
    include: [
      { model: UserModel, as: 'userDetailRecipient' },
      { model: UserModel, as: 'userDetailSender' }
    ],
    order,
    limit,
    offset: (page - 1) * limit,
  })
  // return res.json({
  //   success: true,
  //   message: 'History Transfer by Recipient',
  //   results: trx
  // })
  if (trx.length > 0) {
    const count = await TransferModel.count({
      where: {
        userIdRecipient: userIdRecipient
      }
    })
    
    trx.map(value => {
      value.deductedBalance = Number(value.deductedBalance).toLocaleString('en')
    })
    return res.json({
      success: true,
      message: 'History Transfer by Recipient',
      results: trx,
      pageInfo: {
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        limitData: limit
      }
    })
  } else {
    return res.status(404).json({
      success: false,
      message: 'Data Not Found'
    })
  }
}