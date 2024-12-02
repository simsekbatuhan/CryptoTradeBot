const userService = require('./userService')
const languageService = require('./languageService')

const {Buttons} = require('../models/buttons')
const log = require('../log')

async function editButton(userId, queue, amount) {
    const user = await userService.findByUserId(userId)
    const messages = await languageService.getLanguage(user.telegramId)

    if(!isNaN(amount)) {
        const req = await Buttons.findByUserId(userId)

        const buttons = req != null ? req.dataValues : null

        if(!buttons) {
            Buttons.create({
                [`button${queue}`]: parseInt(amount),
                UserId: userId
              });
              return messages.buttonSaved

        } else {
            const updatedButton = await Buttons.update(
                { [`button${queue}`]: parseInt(amount), },
                { where: { userId: userId } }
            );

            return messages.buttonSaved
        }

    } else {
        return messages.onlyInteger
    }
}

async function findByUserId(userId) {
    const req = await Buttons.findByUserId(userId)
    return buttons = req != null ? req.dataValues : null
}

module.exports = {
    editButton,
    findByUserId
}