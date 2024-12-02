const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const paymentService = require('../../services/paymentService')
const croxydb = require("croxydb");
const settings = require('../../config/settings');
const { References } = require('../../models/reference');
croxydb.setFolder("./database");
const log = require('../../log')


module.exports = {
    name: 'myReferences',
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

            const db = await References.findAll({ where: { referanceOwner: user.id } });
            let references = db.map(ref => ref.dataValues);

            const replyMarkup = {
                inline_keyboard: [   
                ]
            };

            references.reverse()
            references = references.slice(0, 20)
            for(reference of references) {
                const dt = await formatDate(reference.createdAt);
                const user = await userService.findByUserId(reference.userId)
                const emoji = reference.dayEarned == 0 ? settings.statusEmojis.pending : settings.statusEmojis.approved 
                replyMarkup.inline_keyboard.push([{text: `${emoji} ${reference.id} | T:${user.telegramId} | ${dt}`, callback_data: `e`}])
            }
            replyMarkup.inline_keyboard.push([{ text: messages.button_back, callback_data: `backReference-${chatId}` }])

            const sentMsg = await bot.sendMessage(chatId, messages.myReferences, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}
        } catch (error) {
            console.error("Error in account command:", error);
            log.logMessage(`Error in myReferences ${error} ${message}`)
        }
    },
};
