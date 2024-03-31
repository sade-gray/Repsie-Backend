const {searchRecipeByTitle}  = require('../../controllers/posts/search.controller.js')

const searchRoute = require('express').Router()

searchRoute.get('/', searchRecipeByTitle)

module.exports = searchRoute