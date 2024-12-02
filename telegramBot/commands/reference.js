const languageService = require('../../services/languageService')
const userService = require('../../services/userService')
const referencesService = require('../../services/referenceService')
const settings = require('../../config/settings')
const log = require('../../log')

const croxydb = require("croxydb");
croxydb.setFolder("./database");


module.exports = {
    name: 'referance',
    description: '',
    async execute(bot, message, args) {
        try {
            try { await bot.deleteMessage(chatId, message.message_id) } catch { }

            const chatId = message.chat.id;
            const messages = await languageService.getLanguage(chatId);
            const user = await userService.findByTelegramId(chatId)
            const referanceCode = await referencesService.createReferenceCode(user)

            const replyMarkup = {
                inline_keyboard: [
                    [{ text: messages.button_back, callback_data: `backProfile-${chatId}` }],
                    [{ text: messages.button_joinedMyReference, callback_data: `myReferences-${chatId}` }],
                ],
            };
            
            const entryCode = await referencesService.getReferanceCode(chatId)
            const balanceEarned = await referencesService.userTotalEarned(chatId)
            
            const count = await referencesService.countRefUsers(chatId) || 0

            const msg = await messages.refferalMessage
            .replace("{link}", `https://t.me/RawenNewsPro_bot?start=${referanceCode}`)
            .replace("{earned}", balanceEarned).replace("{totalInvite}", count)
            .replace('{reward}', settings.referenceDay)
            .replace("{code}", entryCode || "Bulunmuyor")

            bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', reply_markup: JSON.stringify(replyMarkup) }).then(m => {
                croxydb.set(`lastmessage_${chatId}`, m.message_id)
            })

            try {
                await bot.deleteMessage(chatId, message.message_id)
            } catch { }

        } catch (error) {
            console.log("Error in reference ", error)
            log.logMessage(`Error in reference ${error} ${message}`)
        }
    },
};


