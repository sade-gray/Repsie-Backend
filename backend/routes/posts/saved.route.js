'use strict'
const { getAllSaved, saveNewRecipe, removeSaved } = require('../../controllers/posts/saved.controller.js')
const savedRoute = require('express').Router()

savedRoute.get('/', getAllSaved)
savedRoute.post('/', saveNewRecipe)
savedRoute.delete('/', removeSaved)


module.exports =  savedRoute