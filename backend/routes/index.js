const express = require('express')
const emailRoute = require('./email.route.js')
const recipeRoute = require('./posts/recipe.route.js')
const commentRoute = require('./posts/comment.route.js')
const ratingRoute = require('./posts/rating.route.js')
const savedRoutes = require('./posts/saved.route.js')
const imageRoutes = require('./posts/images.route.js')
const emailUser = require('./user/email.route.js')

const router = express.Router()

const routesIndex = [
    {
        path: '/contactus', 
        route: emailRoute
    },
    {
        path: '/recipes',
        route: recipeRoute
    },
    {
        path: '/comments',
        route: commentRoute
    },
    {
        path: '/rating',
        route: ratingRoute
    },
    {
        path: '/saved',
        route: savedRoutes
    },
    {
        path:'/user',
        route: emailUser
    },
    {
        path:'/image',
        route: imageRoutes
    }
]

routesIndex.forEach((route) => router.use(route.path, route.route))

module.exports =  router