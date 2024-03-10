'use strict'
const multer = require('multer')
const imageRoute = require('express').Router()

const {uploadImage} = require('../../controllers/posts/images.controller.js')

const upload = multer()

imageRoute.post('/', upload.single('file'), uploadImage)


module.exports =  imageRoute