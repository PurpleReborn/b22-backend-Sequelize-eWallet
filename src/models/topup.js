const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')
const UserModel = require('../models/users')

const TopUp = sequelize.define('topup', {
  userId: Sequelize.INTEGER,
  refNo: Sequelize.STRING,
  deductedBalance: Sequelize.INTEGER,
  topUpFee: Sequelize.INTEGER
})

TopUp.belongsTo(UserModel, {foreignKey: 'userId', sourceKey: 'id', as: 'detail'})

module.exports = TopUp