const {userAddPhoneName, getSettingsUser} = require('../../controllers/user/settings.controller.js')

const settingsUser = require('express').Router()

settingsUser.post('/phone-name', userAddPhoneName)
settingsUser.get('/phone-name', getSettingsUser)

module.exports = settingsUser