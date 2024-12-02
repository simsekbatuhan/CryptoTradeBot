const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const settings = require('../../config/settings');
const buttonsService = require('../../services/buttonsService');
const log = require('../../log')

const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'editButtons',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;
            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);
            if (!args[2]) {

                const buttons = await buttonsService.findByUserId(user.id)

                let replyMarkup = {
                    inline_keyboard: [
                        [
                            { text: messages.button_long, callback_data: `${chatId}` },
                            { text: messages.button_symbols, callback_data: `${chatId}` },
                            { text: messages.button_short, callback_data: `${chatId}` }
                        ],
                        [
                            { text: buttons ? buttons.button1 : " - ", callback_data: `editButtons-${chatId}-1` },
                            { text: "BTC", callback_data: `${chatId}` },
                            { text:  buttons ? buttons.button1 : " - ", callback_data: `editButtons-${chatId}-1` }
                        ],
                        [
                            { text:  buttons ? buttons.button2 : " - ", callback_data: `editButtons-${chatId}-2` },
                            { text: "ETH", callback_data: `${chatId}` },
                            { text:  buttons ? buttons.button2 : " - ", callback_data: `editButtons-${chatId}-2` }
                        ],
                        [
                            { text:  buttons ? buttons.button3 : " - ", callback_data: `editButtons-${chatId}-3` },
                            { text: "LTC", callback_data: `${chatId}` },
                            { text:  buttons ? buttons.button3 : " - ", callback_data: `editButtons-${chatId}-3` }
                        ],
                        [
                            { text:  buttons ? buttons.button4 : " - ", callback_data: `editButtons-${chatId}-4` },
                            { text: "XRP", callback_data: `${chatId}` },
                            { text:  buttons ? buttons.button4 : " - ", callback_data: `editButtons-${chatId}-4` }
                        ],

                        [{ text: messages.button_back, callback_data: 'backMarket-${chatId}' }]
                    ],

                };

                const sent = await bot.sendMessage(chatId, messages.editButtons, {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify(replyMarkup)
                });
                croxydb.set(`lastmessage_${chatId}`, sent.message_id);

                try {
                    await bot.deleteMessage(chatId, message.message_id)
                } catch { }

                return
            }

            try {
                await bot.deleteMessage(chatId, message.message_id)
            } catch { }


            var keyboards = {
                reply_markup: {
                    keyboard: [
                        [messages.button_account, messages.button_fqa],
                        [messages.button_sup, messages.button_channel]
                    ],
                    resize_keyboard: true
                }
            };

            const replyMarkup = {
                inline_keyboard: [[{
                    text: messages.button_back,
                    callback_data: `editButtons-${chatId}`
                }]]
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
                            await bot.sendMessage(chatId, messages.editButtons, keyboards);
                            resolve(reply.text);
                        }
                    });
                });
            };


            const amount = await getInput(messages.editButtonMessage);
            if (!amount) return;

            const queue = args[2]

            const req = await buttonsService.editButton(user.id, queue, amount)

            const sent = await bot.sendMessage(chatId, req, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sent.message_id);

        } catch (error) {
            console.error("Error in editButtons:", error.message);
            log.logMessage(`Error in editButtons: ${error} ${message}`)
        }
    },
};
