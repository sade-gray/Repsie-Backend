const {upload} = require('../../cloud.firestore/firestoreNodeJS.js')

const uploadImage = async (req, res) => {
    try {
        console.log(req.file)
        const isUploaded = upload(req.file)
        if (isUploaded) return res.status(201).json({message: "Image uploaded successfully"})

        else {
        return res.status(500).json({error: "Something went wrong while trying to upload your image. Please try again"})
        }
    }

    catch (error) {
        return res.status(500).json({error:'Something went wrong. Please try again later'})
    }
}

module.exports = {
    uploadImage
}