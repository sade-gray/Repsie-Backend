const {userSettings, getUserSettings} = require('../../cloud.firestore/firestoreNodeJS.js')

const userAddPhoneName = async (req, res) => {
    try {
        const { name, phoneNum } = req.body;

        if (!name && !phoneNum) {
            return res.status(400).json({ error: "Bad request: Either name or phone number must be provided" });
        }

        if (name && typeof name !== "string") {
            return res.status(400).json({ error: "Bad request: Name must be a string" });
        }

        if (phoneNum && typeof phoneNum !== "number") {
            return res.status(400).json({ error: "Bad request: Phone number must be a number" });
        }

        const namePattern = /^[a-zA-Z0-9]+$/;
        const phoneNumPattern = /^\d{10}$/;

        if (name && !namePattern.test(name)) {
            return res.status(400).json({ error: 'Invalid name format. Name should contain only letters and numbers.' });
        }

        if (phoneNum && !phoneNumPattern.test(phoneNum)) {
            return res.status(400).json({ error: 'Invalid phone number format. Phone number should contain exactly 10 digits with no symbols.' });
        }

        const userInfo = {}; // Initialize userInfo here

        if (name) {
            userInfo.name = name;
        }

        if (phoneNum) {
            userInfo.phoneNum = phoneNum;
        }

        const settingsUpdated = await userSettings(userInfo, req.query.user);

        if (settingsUpdated) {
            return res.status(201).json({ message: "Your phone number and username were added" });
        } else {
            return res.status(500).json({ error: "This username already exists" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong when adding your details" });
    }
}

const getSettingsUser = async (req, res) => {
    try {
        const userSettingsGood = await getUserSettings(req.query.user)
        if (userSettingsGood) return res.status(200).json(userSettingsGood)
        else return res.status(500).json({error: "Something went wrong when trying to retrieve your phone number and username"})
    }
    catch (error) {
        return res.status(500).json({error: "Something went wrong when trying to retrieve your phone number and username"})
    }
}

module.exports = {
    userAddPhoneName, 
    getSettingsUser
}
