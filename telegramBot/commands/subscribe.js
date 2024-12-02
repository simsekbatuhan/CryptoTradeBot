const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const settings = require('../../config/settings');
const referenceService = require('../../services/referenceService')
const croxydb = require("croxydb");
croxydb.setFolder("./database");
const log = require('../../log')
module.exports = {
    name: 'subscribe',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;

            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);

            if (user.subscribe) {

                const replyMarkup = {
                    inline_keyboard: 
                        [[{
                            text: messages.button_back,
                            callback_data: `backProfile-${chatId}`
                        }]]
                    
                };

                const msg = await bot.sendMessage(chatId, messages.errorSub, {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify(replyMarkup)
                });
                croxydb.set(`lastmessage_${chatId}`, msg.message_id);
                try {
                    await bot.deleteMessage(chatId, message.message_id);
                } catch {}
                return;
            }
            

            const reference = await referenceService.findByUserId(user.id)
            
            let discountRate = 0;
            
            if (reference) {
                const referenceOwner = await userService.findByUserId(reference.referanceOwner);
                for (const discount of settings.discountReference) {
                    if (referenceOwner.referenceCode === discount.code) {
                        discountRate = discount.rate || 0;
                        break;
                    }
                }
            }
            
            const replyMarkup = {
                inline_keyboard: [
                    ...settings.subPackages.map(sub => {
                        const cleanedName = sub.name.replace(/[{}]/g, '');
                        const messageText = messages[cleanedName] || "Varsayılan Değer";
                        
                        const discountedPrice = sub.price - (sub.price * discountRate / 100);
            
                        return [{
                            text: `${messageText} - ${discountedPrice.toFixed(2)}$`, 
                            callback_data: `subscribe-${chatId}-${sub.packetNumber}-null`
                        }];
                    }),
                    [{
                        text: messages.button_back,
                        callback_data: `backProfile-${chatId}`
                    }]
                ]
            };

            const ss = discountRate == 0 ? messages.subscribe.replace("{discount}", "") : messages.subscribe.replace("{discount}", messages.discountMessage.replace("{rate}", `%${discountRate}`))
            const sentMsg = await bot.sendMessage(chatId, ss, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}
        } catch (error) {
            console.error("Error in subscribe command:", error);
            log.logMessage(`Errpr in subcscribe ${error} ${message}`)
        }
    },
};
