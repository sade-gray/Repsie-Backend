'use strict'

const { like,
        unlike,
        getLikes, 
        countLikes } = require('../../cloud.firestore/firestoreNodeJS.js')


const getLikeCount = async (req, res) => {
    try {
        const total = await countLikes(req.query.post)
        if (total >= 0) {
            return res.status(200).json({totalLikes:total})
        }
        else return res.status(500).json({mesage:"Something went wrong when retrieving your comments"})
    }

    catch (error) {
        return res.status(500).json({error:'Something went wrong. Please try again later'})
    }
}

const likePost = async (req, res) => {
    try {
        let isLiked = await like(req.query.post, req.query.user)
        
        if (isLiked) return res.status(201).json({message: "You have liked this post"})
        
        else return res.status(500).json({error: "Something went wrong when liking this post"})
    }

    catch (error) {
        throw res.status(400).json({error:'Something went wrong. Please try again later'})
    }
}


const unlikePost = async (req, res) => { 
    try {
        let isUnLiked = await unlike(req.query.post, req.query.user)

        if (isUnLiked) return res.status(200).json({message: 'Unliked successfully'})

        else return res.status(500).json({error: "Something went wrong when trying to unlike your post. Please try again later"})
    } 
    catch (error) {
        return res.status(500).json({error: 'Something went wrong. Please try again'});
    }
}

const userLiked = async (req, res) => {
    try {
        let userLikes = await getLikes(req.query.user)

        if (userLikes) return res.status(200).json({getNumUserLikes: userLikes})

        else return res.status(500).json({error: "Unable to get user likes"})
    }

    catch(error) {
        return res.status(500).json({error: "Something went wrong. Please try again later"})
    }
}

module.exports = {
    likePost,
    getLikeCount, 
    unlikePost, 
    userLiked
}

