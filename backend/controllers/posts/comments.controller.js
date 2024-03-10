'use strict'

const { allComments, 
        postComment, 
        deleteComment } = require('../../cloud.firestore/firestoreNodeJS.js')


// CPU is little endian format for nodejs environment

const getAllComments = async (req, res) => {
   try {  
        const postComments = await allComments(req.query.post)

        if (postComments) return res.status(200).json(postComments)

        else return res.status(500).json({message: "Something went wrong when retrieving this post's comments"})
    }

    catch (error) {
        return res.status(400).json({message:'Something went wrong. Please try again later'})
    }
}

const newCommentRecipe = async (req, res) => {
    try {
        const {commentBody, userId} = req.body
        const {post} = req.query

        if (!userId || !commentBody) return res.status(400).json({error: "Bad request"})

        const comment = {
            commentBody: commentBody,
            userId: userId
        }

        const newComment = await postComment(post, comment)

        if (newComment) return res.status(201).json({message:"Your comment has been posted"})

        else return res.status(500).json({error: "Something went wrong when posting your comment. Please try again later"})
    }

    catch (error) {
        return res.status(500).json({error:"Something went wrong. Please try again"})
    }
}


const deletingComment = async (req, res) => {
    try {
        const {commentId} = req.body
        const {post} = req.query

        if (!commentId) return res.status(400).json({error:'Bad request'})

        const isDeleted = await deleteComment(commentId, post)

        if (isDeleted) return res.status(200).json({message: 'Comment deleted successfully'})

        else return res.status(500).json({error: "Could not delete your comment. Try again later"})
    } 
    
    catch (error) {
        res.status(500).json({error: 'Something went wrong. Please try again'})
    }
}

module.exports = {
    newCommentRecipe,
    getAllComments, 
    deletingComment
}
