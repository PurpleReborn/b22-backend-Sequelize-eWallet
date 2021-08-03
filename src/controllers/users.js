const { response } = require('../helpers/standardResponse')
const UserModel = require('../models/users')
const TokenFCM = require('../models/tokenFCM')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const { APP_URL, APP_UPLOAD_ROUTE } = process.env


exports.createUser = async (req,res)=> {
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
  const user = await UserModel.create(req.body)
  return res.json({
    success: true,
    message: 'User Created Successfully',
    results: user
  })
}


exports.login = async (req, res) => {
  const { password} = req.body
  const user = await UserModel.findAll({
    where: {
      phone: {
        [Op.substring]: req.body.phone
      }
    }
  })
  const result = user[0]
  if(result !== undefined){
    const compare = await bcrypt.compare(password, result.password)
    if(compare){
      const token = jwt.sign({id: result.id, phone: result.phone}, process.env.APP_KEY)
      return res.json({
        success: true,
        message: 'Login Success',
        result: token
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'Your password Wrong'
      })
    }
  } else {
    return res.status(404).json({
      success: false,
      message: 'Account not found'
    })
  }
  
}

// exports.login = async (req,res,results)=> {
//   if (!req.body.phone || !req.body.password) {
//     return response(res, 401, false, 'Wrong username or password')
//   } else {
//         const user = await UserModel
//         .findOne({ where:{
//           phone: req.body.phone
//         }
//       })

//       var compare = bcrypt.compare(
//         req.body.password,
//         user.password
//       )
//     if(compare){
//       const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.APP_KEY)
//       return response(res, 200, { token },'Login success')
//     }else {
//       return response(res, 401, false, 'Wrong username or password')
//   }
//   }

// }


// exports.updateUser = async (req,res)=> {
//   const user = await UserModel.findByPk(req.authUser.id)
//   if(req.body.balance){
//     delete req.body.balance
//   }
//   if(user){
//     req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
//     if(req.file){
//       req.body.picture = `${process.env.APP_UPLOAD_ROUTE}/${req.file.filename}`
//       user.set(req.body)
//       await user.save()
//       return response(res, 200, user, 'Item created successfully')
//     }else{
//       user.set(req.body)
//       await user.save()
//       return response(res, 200, user, 'Item created successfully')
//     }
//   }else{
//     return response(res, 404, false, 'Updated failed')
//   }
  


// }

exports.updateUser = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  if (user) {
    if (req.file) {
      req.body.picture = req.file
        ? `${APP_UPLOAD_ROUTE}/${req.file.filename}`
        : null
      user.set(req.body)
      await user.save()
      if (
        user.picture !== null &&
        !user.picture.startsWith('http')
      ) {
        user.picture = `${APP_URL}${user.picture}`
      }
      return res.json({
        success: true,
        message: 'User Updated Successfully',
        results: user
      })
    } else {
      user.set(req.body)
      await user.save()
      if (
        user.picture !== null &&
        !user.picture.startsWith('http')
      ) {
        user.picture = `${APP_URL}${user.picture}`
      }
      return res.json({
        success: true,
        message: 'User Updated Successfully',
        results: user
      })
    }
  } else {
    res.json({
      success: false,
      message: 'User not found'
    })
  }
}

exports.deleteUser = async (req,res)=>{
  const {id} = req.params
  const user = await UserModel.findByPk(id)
  await user.destroy()
  return res.json({
    success: true,
    message: 'User has been deleted',
    results: user
  })
}

exports.listUsers = async (req,res)=>{
  let {search='',sort, limit = 5, page=1} =req.query
  let order = []
  if(typeof sort === 'object'){
    const key = Object.keys(sort)[0]
    let value = sort[key]
    if(value === '1'){
      value = 'DESC'
    }else{
      value= 'ASC'
    }
    order.push([key, value])
  }
 
  if(typeof limit === 'string'){
    limit = parseInt(limit)
  }
  if(typeof page === 'string'){
    page = parseInt(page)
  }

  const user = await UserModel.findAll({
    where: {
      name: {
        [Op.substring]: search
      }
    },
    order,
    limit,
    offset: (page-1) * limit
  })
  const count = await UserModel.count()
  return res.json({
    success: true,
    message: 'List of Users',
    results: user,
    pageInfo: {
      totalPage: Math.ceil(count/limit),
      currentPage:page,
      limitData: limit,
      nextLink: null,
      prevLink: null
    }
  })
}

exports.detailUser = async (req,res)=> {
  const user = await UserModel.findByPk(req.authUser.id)
  return res.json({
    success: true,
    message: 'List of Users',
    results: user
  })
}

exports.registerToken = async (req, res) => {
  const { token } = req.body
  const { id } = req.authUser
  const [fcm, created] = await TokenFCM.findOrCreate({
    where: { token },
    defaults: {
      userId: id
    }
  })
  if (!created) {
    fcm.userId = id
    await fcm.save()
  }
  return res.json({
    success: true,
    message: 'Token saved'
  })
}