const languageService = require('../../services/languageService');
const userService = require('../../services/userService');
const settings = require('../../config/settings');
const paymentService = require('../../services/paymentService');
const referenceService = require('../../services/referenceService')
const log = require('../../log')
const croxydb = require("croxydb");
croxydb.setFolder("./database");

module.exports = {
    name: 'buySub',
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
                const msg = await bot.sendMessage(chatId, messages.errorSub);
                croxydb.set(`lastmessage_${chatId}`, msg.message_id);
                try {
                    await bot.deleteMessage(chatId, message.message_id);
                } catch { }
                return;
            }

            if (args[3] === "null") {
                const replyMarkup2 = {
                    inline_keyboard: [
                        ...settings.paymentMethods.map(payment => [{
                            text: payment.name,
                            callback_data: `subscribe-${chatId}-${args[2]}-${payment.name}-${payment.coin}`
                        }]),
                        [{
                            text: messages.button_back,
                            callback_data: `backProfile-${chatId}`
                        }]
                    ]
                };

                const msg = await bot.sendMessage(chatId, messages.selectPaymentType, {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify(replyMarkup2)
                });
                croxydb.set(`lastmessage_${chatId}`, msg.message_id);
                try {
                    await bot.deleteMessage(chatId, message.message_id);
                } catch { }
                return;
            }

            const package = settings.subPackages.find(sub => sub.packetNumber == args[2]);

            if (!package) return bot.sendMessage(chatId, messages.packageNotFound);

            const reference = await referenceService.findByUserId(user.id);

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

            const editedPackage = { ...package };

            const pacPrice = discountRate === 0 ? package.price : package.price - (package.price * discountRate / 100);
            editedPackage.price = pacPrice;

            const payment = await paymentService.createPayment(
                pacPrice,
                args[4],
                editedPackage,
                args[3],
                user.id,
                discountRate === package.price ? false : true
            );

            let msg;
            let price;
            if (payment != null) {
                price = Math.max(payment.pay_amount.toFixed(2), pacPrice);
                msg = messages.deposit
                    .replaceAll("{price}", price)
                    .replace("{day}", package.day)
                    .replace("{address}", payment.pay_address)
                    .replaceAll("{symbol}", args[3])
                    .replace("{paymentErr}", "");
            } else {
                price = pacPrice.toFixed(2)
                msg = messages.deposit
                    .replaceAll("{price}", price)
                    .replace("{day}", package.day)
                    .replace("{address}", "0xEDe755b6Eee25B59EC0204e2B6BfBa6b60d64D4b")
                    .replaceAll("{symbol}", args[3])
                    .replace("{paymentErr}", messages.paymentErr);

            }

            const replyMarkup = {
                inline_keyboard: [[{
                    text: messages.button_back,
                    callback_data: `backProfile-${chatId}`
                }]]
            };

            const sentMsg = await bot.sendMessage(chatId, msg, {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(replyMarkup)
            });
            croxydb.set(`lastmessage_${chatId}`, sentMsg.message_id);

            bot.sendMessage(chatId, payment.pay_address)

            try {
                await bot.deleteMessage(chatId, message.message_id);
            } catch { }

        } catch (error) {
            console.error("Error in buySub:", error);
            log.logMessage(`Error in buySub ${error} ${message}`,)
        }
    },
};
