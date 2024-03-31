const {searchByTitle} = require('../../cloud.firestore/firestoreNodeJS.js')

const searchRecipeByTitle = async (req, res) => {
    try {
        const recipes = await searchByTitle(req.query.title)
        if (recipes) {
            return res.status(200).json(recipes)
        }
        else return res.status(500).json({error:"Something went wrong"})
    } catch(err) {
        return res.status(500).json({error:"Something went wrong"})
    }
}

module.exports = {
    searchRecipeByTitle
}