'use strict'
const { newCommentRecipe,
        getAllComments, 
        deletingComment } = require('../../controllers/posts/comments.controller.js')
const commentRoute = require('express').Router()

commentRoute.post('/', newCommentRecipe)
commentRoute.get('/', getAllComments)
commentRoute.delete('/', deletingComment)

module.exports =  commentRoute