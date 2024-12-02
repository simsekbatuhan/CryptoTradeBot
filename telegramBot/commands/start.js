const userService = require('../../services/userService')
const referenceService = require('../../services/referenceService')

const croxydb = require("croxydb");
croxydb.setFolder("./database");
const log = require('../../log')


module.exports = {
    name: 'start',
    description: '',
    async execute(bot, message, match) {
        try {
            const chatId = message.chat.id;

            //await bot.deleteMessage(chatId, message.message_id)
            await userService.createUser(chatId);
            
            const replyMarkup = {
                inline_keyboard:
                    [
                        [{ text: 'Türkçe', callback_data: `selectLanguage-TR` }],
                        [{ text: 'English', callback_data: `selectLanguage-EN` }],
                        [{ text: 'український', callback_data: `selectLanguage-UK` }],
                        [{ text: 'Русский', callback_data: `selectLanguage-RU` }]
                    ]
            }

            if(match) {
                const startParam = match.input.split(' ');
                const referenceCode = startParam[1];
    
                if (referenceCode) {
                    const joinReferance = await referenceService.joinReference(chatId, referenceCode)
                    bot.sendMessage(chatId, await joinReferance)
                }
            }

            bot.sendMessage(chatId, 'Hi! Select system language', { reply_markup: JSON.stringify(replyMarkup) }).then(m => {
                croxydb.set(`lastmessage_${chatId}`, m.message_id)
            }
            );
        } catch (error) {
            console.log("Error in start ", error.message)
            log.logMessage(`Error in start ${error.message} ${message}`)
        }
    },
};
