// const { Sequelize } = require('sequelize')
const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const User = sequelize.define('users',{
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phone:Sequelize.STRING,
  balance:Sequelize.INTEGER,
  name:Sequelize.STRING,
  picture: Sequelize.STRING
})

module.exports = User