
const TelegramBot = require('node-telegram-bot-api');

const settings = require('../config/settings');
const userService = require('../services/userService')
const languageService = require('../services/languageService')
const paymentService = require('../services/paymentService')
const log = require('../log')
const croxydb = require("croxydb");
croxydb.setFolder("./database");

const fs = require('fs');
const { Language } = require('../models/user');
const marketService = require('../services/marketService');
const buttonsService = require('../services/buttonsService');
const bybitService = require('../marketServices/bybit');
const binanceService = require('../marketServices/binance')
const botService = require('../services/botService')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
bot.commands = new Map();

const loadCommands = () => {
    const commandFiles = fs.readdirSync('./telegramBot/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
    }
};
loadCommands();

let bybitSymbols;
let binanceSymbols;

async function sendMessage(userId, message) {
    const messages = await languageService.getLanguage(userId);
    var keyboards = {
        reply_markup: {
            keyboard: [
                [messages.button_account, messages.button_fqa],
                [messages.button_sup, messages.button_channel]
            ],
            resize_keyboard: true
        }
    };
    bot.sendMessage(userId, message, keyboards)
}

async function sendNews(message, coins, users, lang) {
    let messages = { TR: message };
    let symbols = { all: coins };

    for (const user of users) {
        try {
            const msg = messages[lang] || (messages[lang] = await require('../news').translateText(message, lang));
            const market = await marketService.findByUserId(user.id) || null;

            let list = [];

            if (market) {
                if (symbols[market.market]) {
                    list = symbols[market.market]
                } else {
                    if (coins.length >= 1) {
                        if (market.market == "bybit") {
                            list = coins
                                .map(item => {
                                    const formattedSymbol = `${item}`;

                                    const bybitsym = bybitSymbols.find(mm => mm.name.replace("USDT", "").replaceAll("1", "").replaceAll("0", "") == formattedSymbol.replace("$", "").replace("USDT", "").toUpperCase());
                                    return bybitsym ? bybitsym : null;
                                })
                                .filter(detail => detail !== null);

                            symbols[market.market] = list
                        } else if (market.market == "binance") {
                            list = coins
                                .map(item => {
                                    const formattedSymbol = `${item}`;
                                    const binanceSym = binanceSymbols.find(mm => mm.name.replace("USDT", "").replaceAll("1", "").replaceAll("0", "") == formattedSymbol.replace("$", "").replace("USDT", "").toUpperCase());
                                    return binanceSym ? binanceSym : null;
                                })
                                .filter(detail => detail !== null);
                        }
                    }

                }
            }


            sendNew(user, msg, list)
        } catch (err) {
            console.log(`Error in sendNews ${err.message}`)
            log.logMessage(`Error in sendNews ${err}`)
        }
    }
}


async function sendNew(user, message, symbols) {
    try {
        const market = await marketService.findByUserId(user.id) || null;
        const messages = await languageService.getLanguage(user.id);
        let chatId = user.telegramId;

        if (market) {
            const buttons = await buttonsService.findByUserId(user.id);

            let coins = symbols
            if (symbols.length < 1) {
                bot.sendMessage(user.telegramId, message);
                return
            }

            coins = await coins.filter((item, index, self) =>
                item.name &&
                self.findIndex(i => i.name === item.name) === index
            );

            while (coins.length < 4) {
                coins.push({ "x": " " })
            }

            let buttonsCount = 4;
            let replyMarkup = {
                inline_keyboard: [
                    [
                        {
                            text: messages?.button_long || "Long",
                            callback_data: `${chatId}`
                        },
                        {
                            text: messages?.button_symbols || "Symbols",
                            callback_data: `${chatId}`
                        },
                        {
                            text: messages?.button_short || "Short",
                            callback_data: `${chatId}`
                        }
                    ],
                    ...(

                        coins.map((coin, index) => {
                            let buttonIndex = index;
                            let buttonText = buttons?.[`button${buttonIndex + 1}`] || `-`;
                            let coinText = coin.name || "-";

                            let coinCallbackData = index === 0
                                ? `selectCoin-active-${coinText}-${coin.qty_step}-${coin.quantityPrecision}-${coin.pricePrecision}`
                                : `selectCoin-disable-${coinText}-${coin.qty_step}-${coin.quantityPrecision}-${coin.pricePrecision}`;
                            let coinTxt = index === 0 ? `🟢 ${coinText}` : coinText;

                            return [
                                { text: buttonText, callback_data: `openOrder-Long-${buttonText}-${market.market}` },
                                { text: coinTxt, callback_data: coinCallbackData },
                                { text: buttonText, callback_data: `openOrder-Short-${buttonText}-${market.market}` }
                            ];
                        })

                    )
                ],
            };

            try {
                const sent = await bot.sendMessage(user.telegramId, message, {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify(replyMarkup),
                });
            } catch(err) {console.log("Mesaj gönderilmedi", err.message)}


        } else {
            try {
                await bot.sendMessage(user.telegramId, message);
            } catch(err) {console.log("Mesaj gönderilmedi", err.message)}
            
        }
    } catch (error) {
        console.error("Error in sendNew function:", error);
        log.logMessage(`Error in sendnew ${error}`)
        await bot.sendMessage(user.telegramId, "There was an error sending the news..");
    }
}

bot.onText(/\/start/, (msg, match) => {
    bot.commands.get('start').execute(bot, msg, match);
});

const {User} = require('../models/user')
bot.onText(/\/onay (.+)/, async (msg, match) => {
    const args = match[1].split(' ');
    const chatId = msg.chat.id
    console.log(chatId)
    console.log(settings.ownerIds.includes(chatId))
    if(!settings.ownerIds.includes(`${chatId}`))  return
    if(args[0]) {
        
        const user = await userService.findByTelegramId(args[0])
        const messages = await languageService.getLanguage(args[0])
        console.log()
        const currentDate = new Date();
        console.log(user)
        sendMessage(user.telegramId, messages.approvedPayment);
    
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + 30);
        
        await User.update(
          { subscriptionEnd: endDate, subscribe: true },
          { where: { id: user.id } }
        );
        
        bot.sendMessage(chatId, "Verildi")
        log.logMessage(`${user.id} Ödeme onaylandı`)

    }
});

bot.onText(/\/bot (.+)/, async (msg, match) => {
    const args = match[1].split(' ');
    const chatId = msg.chat.id
    console.log(chatId)
    console.log(settings.ownerIds.includes(chatId))
    if(!settings.ownerIds.includes(`${chatId}`))  return
    if(args[0]) {
        
        const version = args[0] == "null" ? null : args[0]
        const status = args[1] == "null" ? null : args[1]

        const request = await botService.edit(version, status)
        bot.sendMessage(chatId, request)        
    }
});

bot.onText(/\/red (.+)/, async (msg, match) => {
    const args = match[1].split(' ');
    const chatId = msg.chat.id
    console.log(chatId)
    console.log(settings.ownerIds.includes(chatId))
    if(!settings.ownerIds.includes(`${chatId}`))  return
    if(args[0]) {
        
        const user = await userService.findByTelegramId(args[0])
        const messages = await languageService.getLanguage(args[0])
        console.log()
        const currentDate = new Date();
        console.log(user)
        //sendMessage(user.telegramId, messages.approvedPayment);
    
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + 30);
        
        await User.update(
          { subscriptionEnd: null, subscribe: null },
          { where: { id: user.id } }
        );
        
        bot.sendMessage(chatId, "alındı")
        log.logMessage(`${user.id} abonelik alındı`)

    }
});



bot.onText(/\/id/, (msg, match) => {
    console.log(msg)
});

bot.on('message', async (msg) => {
    try {
        const chatId = msg.chat.id;
        const messageId = msg.message_id
        const text = msg.text
        const messages = await languageService.getLanguage(chatId)

        if (text.includes("ℹ")) {

            const msg = await bot.sendMessage(chatId, messages.sss, {parse_mode: "Markdown"})
            await deleteLastMessage(chatId)
            croxydb.set("lastMessage", msg.message_id)
        } else if (text.includes("🆘")) {

            bot.commands.get('support').execute(bot, msg);
            await deleteLastMessage(chatId)

        } else if (text.includes("📰")) {

            bot.commands.get('channel').execute(bot, msg);
            await deleteLastMessage(chatId)

        } else if (text.includes("👤")) {

            bot.commands.get('account').execute(bot, msg);
            try {
                await deleteLastMessage(chatId)
            } catch { }
        } else if (text.includes("🤖")) {

            bot.commands.get('bot').execute(bot, msg);
            try {
                await deleteLastMessage(chatId)
            } catch { }
        }
    } catch (error) {

        log.logMessage(error)
    }
})

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data.split('-');
    const data2 = callbackQuery.data.split('*');

    const messages = await languageService.getLanguage(chatId);
    try {
        const commandHandlers = {
            'selectLanguage': async () => {
                const returnMessage = await selectLanguage(chatId, data[1]);
                const messagess = await languageService.getLanguage(chatId);
                const keyboards = {
                    reply_markup: {
                        keyboard: [
                            //, messagess.button_fqa
                            [messages.button_account, messages.button_fqa],
                            [messagess.button_sup, messagess.button_channel]
                        ],
                        resize_keyboard: true
                    }
                };
                await deleteLastMessage(chatId, null);

                await bot.sendMessage(chatId, returnMessage, keyboards);
                executeCommand(bot, callbackQuery.message, 'account')
            },
            'openOrder': async () => {
                const user = await userService.findByTelegramId(chatId)
                const market = await marketService.findByUserId(user.id)

                let activeItems = callbackQuery.message.reply_markup.inline_keyboard.flat().filter(item =>
                    item.callback_data.includes('active')
                );

                let item = activeItems[0].callback_data.split("-")
                let symbol = item[2]

                if (market.market == "bybit") {

                    const price = await bybitService.getCoinPrice(symbol)

                    let amount = data[2] / price
                    const qty_step = await bybitService.getQty_step(symbol)
                    amount = roundToStep(amount, qty_step)

                    let side = data[1] == "Long" ? "Buy" : "Sell"

                    const order = await bybitService.createOrder(market.apiKey, market.secretKey, amount, symbol, side)

                    if (order.retMsg == "OK") {

                        const replyMarkup = {
                            inline_keyboard: [
                                [{ text: messages.button_closeOrder, callback_data: `closeOrder-${symbol}-${market.market}-${side}` }]
                            ]
                        };

                        bot.sendMessage(chatId, messages.createdOrder, {
                            parse_mode: 'Markdown',
                            reply_markup: JSON.stringify(replyMarkup)
                        });

                    } else {
                        bot.sendMessage(chatId, messages.errorCreateOrder.replace("{err}", order.retMsg))
                    }

                } else if (market.market == "binance") {

                    const roundToPrecision = (quantity, precision) => {
                        const factor = Math.pow(10, precision);
                        return Math.floor(quantity * factor) / factor;
                    };

                    const quantityPrecision = item[4]
                    const price = await binanceService.getCoinPrice(market.apiKey, market.secretKey, item[2])


                    let amount = data[2] / price
                    amount = roundToPrecision(amount, quantityPrecision);

                    const side = data[1] == "Long" ? "BUY" : "SELL"

                    const order = await binanceService.createOrder(market.apiKey, market.secretKey, amount, item[2], side)

                    if (order.orderId) {

                        const replyMarkup = {
                            inline_keyboard: [
                                [{ text: messages.button_closeOrder, callback_data: `closeOrder-${symbol}-${market.market}-${amount}-${side}` }]
                            ]
                        };

                        bot.sendMessage(chatId, messages.createdOrder, {
                            parse_mode: 'Markdown',
                            reply_markup: JSON.stringify(replyMarkup)
                        });
                    } else if (order == "hedgeError") {


                        const messages = await languageService.getLanguage(chatId)
                        bot.sendMessage(chatId, messages.binanceSideError)

                    } else {
                        bot.sendMessage(chatId, messages.errorCreateOrder.replace("{err}", order))
                    }
                }
            },
            'selectCoin': async () => {
                const inline_keyboard = callbackQuery.message.reply_markup.inline_keyboard;
                let selectedCoin = data[2];
                let updated = false; 
                
                for (const row of inline_keyboard) {
                    for (const button of row) {
                        const match = button.callback_data.split("-");
                        if(button.text == "-") continue
                        if (match[2] === selectedCoin) { 
                            if (button.callback_data.includes("active")) {
                               
                                button.callback_data = button.callback_data.replace("active", "disable");
                                button.text = `${match[2]}`;
                            } else if (button.callback_data.includes("disable")) {
                               
                                button.callback_data = button.callback_data.replace("disable", "active");
                                button.text = `🟢 ${match[2]}`;
                            }
                            updated = true; 
                        } else if (button.callback_data.includes("active")) {
                            button.callback_data = button.callback_data.replace("active", "disable");
                            button.text = `${match[2]}`;
                        }
                    }
                }

                if (!updated) {
                    console.error("Seçilen coin ile eşleşen bir buton bulunamadı.");
                    return; 
                }

                const reply_markup = { inline_keyboard };
                
                try {
                    await bot.editMessageReplyMarkup(reply_markup, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    });
                    console.log("Butonlar başarıyla güncellendi.");
                } catch (error) {
                    console.error("Butonları güncellerken bir hata oluştu:", error);
                }
            },
            'closeOrder': async () => {
                const user = await userService.findByTelegramId(chatId)
                const market = await marketService.findByUserId(user.id)

                if (data[2] == "bybit") {

                    const request = await bybitService.cloderOrderById(market.apiKey, market.secretKey, data[1], data[3])

                    if (request.retMsg == "OK") {
                        bot.sendMessage(chatId, messages.closedOrder)
                    } else {
                        bot.sendMessage(chatId, messages.errorCloseOrder.replace("{err}", request.retMsg))
                    }
                } else if (data[2] == "binance") {

                    const request = await binanceService.closePosition(market.apiKey, market.secretKey, data[1], data[3], data[4])

                    if (request.orderId) {
                        bot.sendMessage(chatId, messages.closedOrder)
                    } else if (request == "hedgeError") {
                        console.log(request)
                        const messages = await languageService.getLanguage(chatId)
                        bot.sendMessage(chatId, messages.binanceSideError)
                    } else {
                        bot.sendMessage(chatId, messages.errorCloseOrder.replace("{err}", request))
                    }
                }

            },
            'selectMarket': async () => {
                executeCommand(bot, callbackQuery.message, 'selectMarket')
            },
            'subscribeInfo': async () => {
                executeCommand(bot, callbackQuery.message, 'subscribe')
            },
            'subscribe': async () => {
                executeCommand(bot, callbackQuery.message, 'buySub', data)
            },
            'backProfile': () => {
                executeCommand(bot, callbackQuery.message, 'account')
            },
            'backPayments': () => {
                executeCommand(bot, callbackQuery.message, 'myPayments')
            },
            'myPayments': () => {
                executeCommand(bot, callbackQuery.message, 'myPayments')
            },
            'paymentInfo': () => {
                executeCommand(bot, callbackQuery.message, 'paymentInfo', data)
            },
            'referance': () => {
                executeCommand(bot, callbackQuery.message, 'referance')
            },
            'myReferences': () => {
                executeCommand(bot, callbackQuery.message, 'myReferences')
            },
            'backReference': () => {
                executeCommand(bot, callbackQuery.message, "referance")
            },
            'marketInfo': () => {
                executeCommand(bot, callbackQuery.message, "marketInfo", data)
            },
            'enterMarketkeys': () => {
                executeCommand(bot, callbackQuery.message, "enterMarketkeys", data)
            },
            'market': () => {
                executeCommand(bot, callbackQuery.message, 'market')
            },
            'backMarket': () => {
                executeCommand(bot, callbackQuery.message, 'market')
            },
            'editButtons': () => {
                executeCommand(bot, callbackQuery.message, 'editButtons', data)
            },
            'selectLangg': () => {
                executeCommand(bot, callbackQuery.message, 'start')
            },
            'feedback': () => {
                executeCommand(bot, callbackQuery.message, 'feedback')
            },
            'changeLogs': () => {
                executeCommand(bot, callbackQuery.message, 'changeLogs')
            },
            'bot': () => {
                executeCommand(bot, callbackQuery.message, 'bot')
            }
        }   

        const handler = data2.length > 2 ? commandHandlers[data2[0]] : commandHandlers[data[0]];
        if (handler) {
            await handler();
        }

    } catch (error) {
        console.log(`Error in callback query `, error)
        log.logMessage(`${chatId} Error in callback query ${error}`)
    }

});

async function executeCommand(bot, msg, command, args) {
    bot.commands.get(command).execute(bot, msg, args || null)
}

async function selectLanguage(chatId, language) {
    return await userService.updateUserLangueage(chatId, language);
}

async function deleteLastMessage(chatId, messageId) {
    try {
        if (messageId != null) {
            await bot.deleteMessage(chatId, messageId)
            return
        }
        const lastMessageId = await croxydb.fetch(`lastmessage_${chatId}`)
        await bot.deleteMessage(chatId, lastMessageId)
    } catch { }
}

module.exports = {
    sendMessage,
    sendNews,
    deleteLastMessage
}

async function fillSymbols() {

    bybitSymbols = await bybitService.getCoins()
    binanceSymbols = await binanceService.getCoins()

}
fillSymbols()

function roundToStep(value, step) {
    return Math.round(value / step) * step;
}