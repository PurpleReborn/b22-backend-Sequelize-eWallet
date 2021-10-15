require('dotenv').config()
const {APP_PORT, APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env
const express = require('express')
const sequelize = require('./src/config/sequelize')
const router = require('./src/routes')
const cors = require('cors')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH))
app.use(cors())
app.use('/',router)

const port = APP_PORT || 8080

app.listen(port, ()=>{
  console.log(`App running on port ${APP_PORT}`)
  sequelize.sync()
})