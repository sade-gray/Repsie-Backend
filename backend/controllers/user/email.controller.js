const { emailSignUp, message, emailUserUpdate, tokenGen, verifyCredentials} = require('../../cloud.firestore/firestoreNodeJS.js')

const signInByEmail = async (req, res) => {
    try{
        const {email, password} = req.body
        
        if (typeof email !== "string" || typeof password !== "string") return res.status(400).json({error:"Bad request"})
        else if (!verifyCredentials(email, password)) {
            return res.status(400).json({error:"Password and email do not match"})
        }
        else {
                const token = await tokenGen(email)
                return res.send(token)
      
        }
    } catch(error) {
        return res.status(500).json({error:'Internal server error'})
    }
}

const signUpByEmail = async (req, res) => {
    try {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const lowerCaseLetters = /[a-z]/g;
        const upperCaseLetters = /[A-Z]/g;
        const numbers = /[0-9]/g;
        const { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Bad request' });
        } else if (!emailPattern.test(email)) {
            return res.status(400).json({ error: 'Bad request' });
        } else if (
            password.length < 8 ||
            !numbers.test(password) ||
            !upperCaseLetters.test(password) ||
            !lowerCaseLetters.test(password)
        ) {
            return res.status(400).json({
                message:
                    'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
            });
        } else {
            // Assuming emailSignUp is a function that returns true on success
            const signUpSuccess = await emailSignUp(email, password);

            if (signUpSuccess) {
                return res.status(200).json({
                    message: 'Your new account has been created. Please log in',
                });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error('Error in signUpByEmail:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const updateUserEmailDetails = async (req, res) => {
    try {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const lowerCaseLetters = /[a-z]/g
        const upperCaseLetters = /[A-Z]/g
        const numbers = /[0-9]/g
        const {email, password} = req.body
        if (typeof email !== "string" || typeof password !== "string") return res.status(400).json({error:"Bad request"})
        else if (!emailPattern.test(email)) return res.status(400).json({error:"Bad request"})
        else if (password.length < 8 || !numbers.test(password) || !upperCaseLetters.test(password) || !lowerCaseLetters.test(password)) return res.status(400).json({"message":"Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"})
        else if (checkEmail(email)) return res.status(400).json({error:"A user with this email already exists"})
        let toUpdate = {}
        if (email) toUpdate.email = email
        if (password) toUpdate.password = password
        if(emailUserUpdate(req.query.user, toUpdate)) return res.status(200).json({message:"Your details have been updated"})
        else return res.status(500).json({error:"Something went wrong when updating your details"})
    }
    catch (error) {
        return res.status(500).json({error:"Something went wrong when updating your details"})
    }
}

module.exports = {
    signInByEmail, 
    signUpByEmail,
    updateUserEmailDetails
}