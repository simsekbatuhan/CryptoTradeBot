const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const botService = require('../../services/botService')
const log = require('../../log')
const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'feedback',
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
                inline_keyboard: [
                    [
                        { text: messages.button_back, callback_data: `bot-${chatId}` }, 
                    ],

                ]
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
                            const request = await botService.sendFeedback(chatId, user.id, reply.text)
                            const s = await bot.sendMessage(chatId, request, keyboards);
                            croxydb.set(`lastmessage_${chatId}`, s.message_id);
                            resolve(reply.text);
                        }
                    });
                });
            };


            const feedback = await getInput(messages.feedbackMsg);
            if (!feedback) return;

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}
            
        } catch (error) {
            log.logMessage(`error in feedback command: ${error}`)
            console.error("Error in feedback command:", error);
        }
    },
};
