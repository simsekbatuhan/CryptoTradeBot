const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const settings = require('../../config/settings');
const marketService = require('../../services/marketService');
const log = require('../../log')

const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'enterMarketkeys',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;
            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);

            const replyMarkup = {
                inline_keyboard: [[{
                    text: messages.button_back,
                    callback_data: `backProfile-${chatId}`
                }]]
            };

            var keyboards = {
                reply_markup: {
                    keyboard: [
                        [messages.button_account, messages.button_fqa],
                        [messages.button_sup, messages.button_channel]
                    ],
                    resize_keyboard: true
                }
            };

            const options = {
                reply_markup: {
                    force_reply: true
                }
            };

            const getInput = async (textPrompt) => {
                const sentMessage = await bot.sendMessage(chatId, textPrompt, {
                    reply_markup: { force_reply: true }
                });
            
                return new Promise((resolve) => {
                    bot.onReplyToMessage(chatId, sentMessage.message_id, async (reply) => {
                        await bot.deleteMessage(chatId, sentMessage.message_id);
                        await bot.deleteMessage(chatId, reply.message_id);
            
                        if (reply.text.toLowerCase() === messages.cancel.toLowerCase()) {
                            await bot.sendMessage(chatId, messages.canceled, keyboards);
                            resolve(null);
                        } else {
                            await bot.sendMessage(chatId, "Saved", keyboards);
                            resolve(reply.text);
                        }
                    });
                });
            };


            const apiKey = await getInput("Api key giriniz iptal etmek için 'iptal' yazınız");
            if (!apiKey) return;

            const secretKey = await getInput("Secret key giriniz iptal etmek için 'iptal' yazınız");
            if (!secretKey) return;

            const market = args[2]

            const req = await marketService.saveMarket(user.id, market, apiKey, secretKey)
            
            const sent = await bot.sendMessage(chatId, req, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sent.message_id);


        } catch (error) {
            console.error("Error in enter market keys:", error.message);
            log.logMessage(`Error in enterMarketKeys ${error} ${message}`)
        }
    },
};
