'use strict'
const { likePost,
        getLikeCount, 
        unlikePost, 
        userLiked } = require('../../controllers/posts/rating.controller.js')
const ratingRoute = require('express').Router()

ratingRoute.post('/', likePost)
ratingRoute.get('/user', userLiked)
ratingRoute.delete('/', unlikePost)
ratingRoute.get('/post', getLikeCount)

module.exports =  ratingRoute