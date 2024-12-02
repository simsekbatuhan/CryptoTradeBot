const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const paymentService = require('../../services/paymentService')
const croxydb = require("croxydb");
const settings = require('../../config/settings');
croxydb.setFolder("./database");
const log = require('../../log')

module.exports = {
    name: 'myPayments',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;

            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);
            let payments = await paymentService.getPaymentsByUserId(user.id)

            if(payments.length <= 0) {
                const replyMarkup = {
                    inline_keyboard: [
                        [{ text: messages.button_back, callback_data: `backProfile-${chatId}` }]
                    ]
                };

                const sentMsg = await bot.sendMessage(chatId, messages.noPayment, {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify(replyMarkup)
                });
                croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);
                try {
                    await bot.deleteMessage(chatId, message.message_id);
                } catch {}
                return
            }
            
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
                ]
            };

            payments.reverse()
            payments = payments.slice(0, 10)
            for(payment of payments) {
                const dt = await formatDate(payment.createdAt);
                replyMarkup.inline_keyboard.push([{text: `${settings.statusEmojis[payment.status]} ${payment.paymentId} | ${dt}`, callback_data: `paymentInfo-${chatId}-${payment.id}`}])
            }
            replyMarkup.inline_keyboard.push([{ text: messages.button_back, callback_data: `backProfile-${chatId}` }])

            const sentMsg = await bot.sendMessage(chatId, messages.myPayments, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}
        } catch (error) {
            console.error("Error in myPayments command:", error);
            log.logMessage(`Error in myPayments ${error} ${message}`)
        }
    },
};
