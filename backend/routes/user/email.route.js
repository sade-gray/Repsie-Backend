const {signUpByEmail, signInByEmail, updateUserEmailDetails} = require('../../controllers/user/email.controller.js')

const emailUser = require('express').Router()

emailUser.post('/signup', signUpByEmail)
emailUser.post('/signin', signInByEmail)
emailUser.put('/', updateUserEmailDetails)

module.exports = emailUser