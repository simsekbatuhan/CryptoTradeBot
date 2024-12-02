const languageService = require('../../services/languageService')
const userService = require('../../services/userService')
const {Market, markets} = require('../../models/market')
const marketService = require('../../services/marketService')
const log = require('../../log')

const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'market',
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
                inline_keyboard: [
                    [{text: messages.button_selectMarket, callback_data: `selectMarket-${chatId}`}],
                    [{text: messages.button_editButtons, callback_data: `editButtons-${chatId}`}],
                    [{text: messages.button_back, callback_data: `backProfile-${chatId}`}],
                ],
            };
            
            const market = await marketService.findByUserId(user.id)

            const formatDate = (date) => {
                if (!date) return null;
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            };

            const formattedDate = market == null ? messages.notFound : formatDate(market.createdAt);


            const msg = messages.market
                .replace("{market}", market == null ? messages.notFound : market.market)
                .replace("{createdAt}", formattedDate)

            
            bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', reply_markup: JSON.stringify(replyMarkup) }).then(m => {
                croxydb.set(`lastmessage_${chatId}`, m.message_id)
            });

            try {
                await bot.deleteMessage(chatId, message.message_id)
            } catch { }
        } catch (error) {
            console.log(`Error in market `, error)
            log.logMessage(`Error in market ${error} ${message}`)
        }
    },

};
