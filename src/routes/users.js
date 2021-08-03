const users = require('express').Router()
const { createUser, updateUser, deleteUser, listUsers, detailUser, login, registerToken } = require('../controllers/users')
const itemPicture = require('../helpers/upload').single('picture')
const auth = require('../middlewares/auth')


users.delete('/:id', deleteUser)

users.patch('/',auth,itemPicture, updateUser)
users.get('/detail',auth, detailUser)
users.post('/register', createUser)
users.post('/login', login)
users.get('/', listUsers)
users.post('/registerToken', auth, registerToken)


module.exports = users