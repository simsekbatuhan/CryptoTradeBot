const languageService = require('../../services/languageService')
const userService = require('../../services/userService')
const botService = require('../../services/botService')
const log = require('../../log')

const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'changeLogs',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;
       
            const messages = await languageService.getLanguage(chatId); 
            const user = await userService.findByTelegramId(chatId)

            if (user == null) return messages.userNotFound;

            let replyMarkup = {
                inline_keyboard: [
                    [{text: messages.button_back, callback_data: `bot-${chatId}`}],
                ],
            };
            
            const formatDate = (date) => {
                if (!date) return null;
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            };

            let changeLogs = await botService.getChangeLogs()
            changeLogs.reverse()

            let msg = ``

            for(changeLog of changeLogs) {
                msg += `${changeLog.version}\n${changeLog.log}\n\n`
            }
            bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', reply_markup: JSON.stringify(replyMarkup) }).then(m => {
                croxydb.set(`lastmessage_${chatId}`, m.message_id)
            });

            try {
                await bot.deleteMessage(chatId, message.message_id)
            } catch { }
        } catch (error) {
            console.log(`Error in changeLogs `, error)
            log.logMessage(`Error in changeLogs ${error} ${message}`)
        }
    },

};
