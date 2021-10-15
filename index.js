require('dotenv').config()
const {PORT, APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env
const express = require('express')
const sequelize = require('./src/config/sequelize')
const router = require('./src/routes')
const cors = require('cors')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH))
app.use(cors())
app.use('/',router)
app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Backend is running well'
  })
})

const port = PORT || 8080

app.listen(port, () => {
  console.log(`APP running on port ${PORT}`)
  sequelize.sync()
})