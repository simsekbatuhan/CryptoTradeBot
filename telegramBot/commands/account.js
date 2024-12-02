const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const marketService = require('../../services/marketService')
const log = require('../../log')
const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'account',
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

            const formattedDate = formatDate(user.createdAt);
            const subEndFormattedDate = formatDate(user.subscriptionEnd) || messages.notFound;
            const market = await marketService.findByUserId(user.id)

            
            const msg = messages.account
                .replace("{telegramId}", chatId)
                .replace("{createdAt}", formattedDate)
                .replace("{lang}", user.language)
                .replace("{subscriber}", user.subscribe ? messages.available : messages.notFound)
                .replace("{subEndDate}", subEndFormattedDate)
                .replace("{market}", market ? market.market : messages.notFound);

            const replyMarkup = {
                inline_keyboard: [
                    [{ text: messages.button_market, callback_data: `market-${chatId}` }],
                    [{ text: messages.button_sub, callback_data: `subscribeInfo-${chatId}` }],
                    [{ text: messages.button_myPayments, callback_data: `myPayments-${chatId}` }],
                    [{ text: messages.button_reference, callback_data: `referance-${chatId}` }],
                    [{ text: messages.button_selectLang, callback_data: `selectLangg-${chatId}` }],
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
            log.logMessage(`error in account command: ${error}`)
            console.error("Error in account command:", error);
        }
    },
};
