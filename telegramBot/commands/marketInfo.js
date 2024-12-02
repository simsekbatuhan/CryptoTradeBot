const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const croxydb = require("croxydb");
const settings = require('../../config/settings');
const fs = require('fs');
const path = require('path');
const log = require('../../log')

croxydb.setFolder("./database");

module.exports = {
    name: 'marketInfo',
    description: '',
    async execute(bot, message, args) {
        try {
            const chatId = message.chat.id;

            const [messages, user] = await Promise.all([
                languageService.getLanguage(chatId),
                userService.findByTelegramId(chatId)
            ]);

            if (!user) return bot.sendMessage(chatId, messages.userNotFound);

            const market = args[2];
            const page = parseInt(args[3], 10);
            const imageFolder = path.join('./images', market);

            let imageFiles = fs.readdirSync(imageFolder).filter(file => path.extname(file) === '.jpg');

            const maxPages = imageFiles.length;
            const replyMarkup = { inline_keyboard: [] };


            if (page < maxPages) {
                replyMarkup.inline_keyboard.push([
                    { text: messages.button_nextStep.replace("{page}", (page + 1)), callback_data: `marketInfo-${chatId}-${market}-${page + 1}` }
                ]);

            } else {
                replyMarkup.inline_keyboard.push([
                    { text: messages.button_enterMarketkeys, callback_data: `enterMarketkeys-${chatId}-${market}` }
                ]);
            }
            if (page > 1) {
                replyMarkup.inline_keyboard.push([
                    { text: messages.button_previousStep.replace("{page}", (page - 1)), callback_data: `marketInfo-${chatId}-${market}-${page - 1}` }
                ]);
            }
            replyMarkup.inline_keyboard.push([
                { text: messages.button_back, callback_data: `backProfile-${chatId}` }
            ]);

            const cleanedName = `infoMarket_${market}_${page}`;
            const captionText = messages[cleanedName];
            const imagePath = path.join(imageFolder, `${page}.jpg`);

            const sentMsg = await bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
                caption: captionText,
                reply_markup: replyMarkup
            });

            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);
            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch {}


        } catch (error) {
            console.error("Error in marketInfo command:", error);
            log.logMessage(`Error in marketInfo ${error} ${message}`)
        }
    },
};
