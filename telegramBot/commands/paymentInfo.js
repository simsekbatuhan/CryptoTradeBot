const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const paymentService = require('../../services/paymentService')
const croxydb = require("croxydb");
const settings = require('../../config/settings');
croxydb.setFolder("./database");
const log = require('../../log')

module.exports = {
    name: 'paymentInfo',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;

            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);
            const payment = await paymentService.findById(args[2])

            const formatDate = (date) => {
                if (!date) return null;
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${day}.${month}.${year} ${hours}:${minutes}`;
            };

            const replyMarkup = {
                inline_keyboard: [   
                    [{ text: messages.button_back, callback_data: `backPayments-${chatId}` }]
                ]
            };
            
            const package = await JSON.parse(payment.subPackage)

            const msg = messages.paymentInfo
            .replace("{id}", payment.id)
            .replace("{paymentId}", payment.paymentId)
            .replace("{status}", `${messages[payment.status]} ${payment.description != null ? `| ${messages[payment.description]}` : ""}`)
            .replace("{createdAt}", formatDate(payment.createdAt))
            .replace("{packagePrice}", package.price)
            .replace("{packageDay}", package.day)
            .replace("{requiredAmount}", payment.requiredAmount)
            .replace("{receivedAmount}", payment.sendingAmount)
            .replace("{walletAddress}", payment.walletAdress)
            .replace("{coinName}", payment.coinName)

            const sentMsg = await bot.sendMessage(chatId, msg, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });

            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}
        } catch (error) {
            console.error("Error in paymentInfo command:", error);
            log.logMessage(`Error in paymentInfo ${error} ${message}`)
        }
    },
};
