'use strict'
const emailController = require('../controllers/email.controller.js')
const emailRoute = require('express').Router()

emailRoute.post('/', emailController)

module.exports =  emailRoute