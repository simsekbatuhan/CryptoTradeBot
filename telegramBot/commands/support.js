const languageService = require('../../services/languageService')
const settings = require('../../config/settings')

const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'support',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;
            const userId = message.from.id

            const messages = await languageService.getLanguage(userId);

            var keyboards = {
                reply_markup: {
                    keyboard: [
                        [messages.button_account, messages.button_fqa],
                        [messages.button_sup, messages.button_channel]
                    ],
                    resize_keyboard: true
                }
            };

            bot.sendMessage(userId, messages.supMessage, { reply_markup: inlineKeyboard }).then(m => {
                croxydb.set(`lastmessage_${chatId}`, m.message_id)
            });
            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch { }
        } catch (error) {
            console.log(error)
        }
    },

};


