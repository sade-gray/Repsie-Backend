'use strict'
const {
    getSaved,
    newSave,
    deleteSave
} = require('../../cloud.firestore/firestoreNodeJS.js')

const getAllSaved = async (req, res) => {
    try {
        let savedRecipes = await getSaved(req.query.user)
        return res.status(200).json(savedRecipes)
    }

    catch (error) {
        return res.status(500).json({error:"Internal server error. Please try again later"})
    }
}

const saveNewRecipe = async (req, res) => {
    try {
        if (newSave(req.body.id, req.query.user)) return res.status(200).json({message: "Recipe saved successfully"})

        else return res.status(500).json({error: "Something went wrong while trying to save your recipe"})
    }

    catch (error) {
        return res.status(500).json({error: "Internal server error. Please try again"})
    }
}


const removeSaved = async (req, res) => {
   try {
    if (deleteSave(req.body.id, req.query.user)) return res.status(200).json({message: "Recipe unsaved successfully"})

    else return res.status(500).json({error: "Something went wrong while trying to unsave your recipe"})
    }

    catch (error) {
        return res.status(500).json({error:"Internal server error. Please try again later"})
    }
}


module.exports = {
    getAllSaved,
    saveNewRecipe,
    removeSaved,   
}