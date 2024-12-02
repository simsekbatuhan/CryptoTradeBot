const languageService = require('../../services/languageService')
const userService = require('../../services/userService')
const {Market, markets} = require('../../models/market')
const log = require('../../log')

const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'selectMarket',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;
       

            const messages = await languageService.getLanguage(chatId); 
            const user = await userService.findByTelegramId(chatId)

            if (user == null) return messages.userNotFound;

            if(!user.subscribe) {
                bot.sendMessage(chatId, messages.noSub).then(m => {
                    croxydb.set(`lastmessage_${chatId}`, m.message_id)
                });
                try {
                    await bot.deleteMessage(chatId, message.message_id);
                } catch {}
                return
            }
            
            let replyMarkup = {
                inline_keyboard: [],
            };
            
            for (const market in markets) {
                if (market != "empty") {
                    replyMarkup.inline_keyboard.push([{ text: market, callback_data: `marketInfo-${chatId}-${market}-1` }]);
                }
            }

            replyMarkup.inline_keyboard.push([
                { text: messages.button_back, callback_data: `backMarket-${chatId}` }
            ]);
            
            bot.sendMessage(chatId, messages.selectMarket, { parse_mode: 'Markdown', reply_markup: JSON.stringify(replyMarkup) }).then(m => {
                croxydb.set(`lastmessage_${chatId}`, m.message_id)
            });

            try {
                await bot.deleteMessage(chatId, message.message_id)
            } catch { }
        } catch (error) {
            console.log(`Error in selectMarket `, error.message)
            log.logMessage(`Error in selectMarket ${error.message} ${message}`)
        }
    },

};
