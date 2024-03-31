'use strict'
const { format } = require('date-fns')

const {getRecipes,
      updatingRecipe,
      postRecipe,
      getRecipe,
      getUserRecipes, 
      deletingRecipe } = require('../../cloud.firestore/firestoreNodeJS.js')



const getAllRecipes = async (req, res) => {
    try {
        const recipes = await getRecipes()
        if (recipes) {
            return res.status(200).json(recipes)
        }
        else return res.status(500).json({error:"Something went wrong"})
    } catch(err) {
        return res.status(500).json({error:"Something went wrong"})
    }
}

const getUserCreatedRecipes = async (req, res) => {
    try {
        const recipes = await getUserRecipes(req.query.user)
        if (recipes) {
            return res.status(200).json(recipes)
        }
        else return res.status(500).json({error:"Something went wrong"})
    } catch(err) {
        return res.status(500).json({error:"Something went wrong"})
    }
}

const getOneRecipe = async (req, res) => {
    try {
        const recipe = await getRecipe(req.query.post)
        if (recipe) {
            return res.status(200).json(recipe)
        }
        else {
            return res.status(404).json({error: "This post does not exist"})
        }
    }
    catch {

    }
}

const createNewRecipe = async (req, res) => {
    try{
        const {title, recipe, timeRating, skillRating } = req.body     
        if (typeof title !== "string"  || typeof recipe !== "string" || typeof timeRating !== "number" || typeof skillRating !== "number") return res.status(400).json({error:'Bad request'})

        if (!recipe || ! timeRating || !skillRating || !title) return res.status(400).json({error:'Bad request'})
        const newRecipe = {
            title,
            recipe,
            timeRating,
            skillRating,
            userId: req.query.user,
            datePublished: format(new Date(), 'yyyy-MM-dd')
        }

        const newIdDoc = await postRecipe(newRecipe, req.query.user)

        if (newIdDoc) return res.status(201).json({id: newIdDoc})

        else return res.status(500).json({error:"Something went wrong"})
    }

    catch (error) {
       return res.status(500).json({error:'Internal server error. Please try again'})
    }
}

const updateRecipe = async (req, res) => {
    try {
        const {title, id, recipe, timeRating, skillRating } = req.body
        //stuff?post=324j3k8diq97bGK
        if (!req.query.post) return res.status(400).json({"message":"Bad request"})
    
        if (!id) return res.status(400).json({'message':'Bad request'})

        let changesRecipe = {}

        if (title) changesRecipe.title = title
        if (recipe) changesRecipe.recipe = recipe
        if (timeRating) changesRecipe.timeRating = timeRating
        if (skillRating) changesRecipe.skillRating = skillRating

        changesRecipe.lastUpdated = format(new Date(), 'yyyy-MM-dd')

        updatingRecipe(req.query.post, changesRecipe)

        return res.status(201).json({message:"Your recipe has been updated successfully"})
    }

    catch (error) {
        return res.status(500).json({error:'Something went wrong. Please try again'})
    }
}

const deleteRecipe = async (req, res) => {
    try {
        if ( !req.query.post ) return res.status(400).json({error:"Bad request"})

        const isDeleted = await deletingRecipe(req.query.post, req.query.user)

        if (isDeleted)  return res.status(201).json({message: "Your recipe has been deleted successfully"})

        else return res.status(500).json({error:'Something went wrong. Please try again'})
    }

    catch (error) {
        return res.status(500).json({error:'Something went wrong. Please try again'})
    }
}


module.exports = {
    getAllRecipes,
    createNewRecipe,
    updateRecipe,
    deleteRecipe, 
    getUserCreatedRecipes, 
    getOneRecipe
}