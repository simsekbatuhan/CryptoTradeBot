
const { Bot, status} = require('../models/bot')

async function get() {
    const bot = await Bot.findByPk(1)
    return bot.dataValues
}

async function edit(version, status) {
    const bot = await Bot.findByPk(1)

    bot.version = version || bot.dataValues.version
    bot.status = status || bot.dataValues.status
    bot.save()

    return "Veriler güncellendi"
}

module.exports = {
    edit,
    get
}