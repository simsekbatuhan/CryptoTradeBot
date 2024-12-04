const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const botService = require('../../services/botService')
const log = require('../../log')
const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'bot',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;

            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);

            const formatDate = (date) => {
                if (!date) return null;
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            };

            const botS = await botService.get()

            const msg = messages.bot
                .replace("{version}", botS.version)
                .replace("{status}", messages[botS.status])

            const replyMarkup = {
                inline_keyboard: [
                    [
                        { text: messages.button_feedBack, callback_data: `feedback-${chatId}` }, 
                        { text: messages.button_changeLog, callback_data: `changeLogs-${chatId}` }
                    ],[
                        { text: messages.button_back, callback_data: `backProfile-${chatId}` }
                    ]

                ]
            };

            const sentMsg = await bot.sendMessage(chatId, msg, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}
            
        } catch (error) {
            log.logMessage(`error in bot command: ${error}`)
            console.error("Error in bot command:", error);
        }
    },
};
