const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')
const UserModel = require('./users')

const Transaction = sequelize.define('transaction',{
  userId: Sequelize.INTEGER,
  refNo: Sequelize.STRING,
  deductedBalance: Sequelize.INTEGER,
  description: Sequelize.STRING,
  trxFee: Sequelize.INTEGER
})

Transaction.belongsTo(UserModel, {foreignKey: 'userId', sourceKey: 'id', as: 'TrxDetail'})

module.exports = Transaction