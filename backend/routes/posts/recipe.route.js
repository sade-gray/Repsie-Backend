'use strict'
const { createNewRecipe, getAllRecipes, updateRecipe, deleteRecipe, getUserCreatedRecipes, getOneRecipe } = require('../../controllers/posts/recipe.controller.js')
const recipeRoute = require('express').Router()

recipeRoute.post('/', createNewRecipe)
recipeRoute.get('/', getAllRecipes)
recipeRoute.get('/user', getUserCreatedRecipes)
recipeRoute.put('/', updateRecipe)
recipeRoute.delete('/', deleteRecipe)
recipeRoute.get('/recipe', getOneRecipe)

module.exports =  recipeRoute