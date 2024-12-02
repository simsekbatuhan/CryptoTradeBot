const { User, Language } = require('../models/user');
const languages = require('../language/languages')
const log = require('../log')
async function getLanguage(userId) {
    try {
        const user = await User.findByTelegramId(userId) 
        const selectedLanguage = await user != null ? user.dataValues.language : "EN"
        return await languages[selectedLanguage];
    } catch(error) {
        console.log("Error in get language ", error.message)
        log.logMessage(`Error in get language ${userId} ${error.message}`)
    }

}

module.exports = {
    getLanguage
}