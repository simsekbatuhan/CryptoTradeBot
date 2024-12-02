const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram");
const { NewMessage } = require("telegram/events");

const settings = require('./config/settings');
const ai = require('./ai')
const axios = require('axios');
const fs = require('fs');
const input = require("input");

const userService = require('./services/userService')
const { Language } = require('./models/user')
const bot = require('./telegramBot/bot')

const croxydb = require("croxydb");
croxydb.setFolder("./database");
const log = require('./log')
var client;
const sessionFile = './session.txt';
let mexcSymbols;

const bybit = require('./marketServices/bybit')
const { stableSymbols } = require('./config/coins')


var client;

(async () => {
    let stringSession = new StringSession(fs.existsSync(sessionFile) ? fs.readFileSync(sessionFile, 'utf8') : '');

    client = new TelegramClient(stringSession, settings.apiId, settings.apiHash, { connectionRetries: 5 });

    if (!fs.existsSync(sessionFile)) {
        await client.start({
            phoneNumber: async () => await input.text("Telefon numarası:"),
            password: async () => await input.text("Parola (varsa):"),
            phoneCode: async () => await input.text("Doğrulama kodu:"),
            onError: (err) => console.log(err),
        });

        fs.writeFileSync(sessionFile, client.session.save(), 'utf8');
        console.log("Oturum kaydedildi.");
    } else {
        await client.connect();
        console.log("Kaydedilen oturum ile giriş yapıldı.");
    }

    client.addEventHandler(eventPrint, new NewMessage({}));
})();

async function eventPrint(event) {
    const message = event.message;

    try {
        if (message.className == "Message") {
            console.log(message);
            console.log(message.peerId);
            
          
            let channelId = event.originalUpdate?.chatId?.value
                ? `${event.originalUpdate.chatId.value}`
                : null;
            console.log("s");
            
           
            channelId = channelId || (message.peerId?.channelId?.value
                ? `${message.peerId.channelId.value}`
                : null);
            
            console.log("Channel ID:", channelId);
            if (settings.sourceChannels.includes(channelId)) {
                const now = Date.now()
                const lastTime = croxydb.get("function_last_run_time")

                if (lastTime) {
                    if (lastTime) {
                        const diffInSeconds = (now - lastTime) / 1300;
                        if (diffInSeconds < 13) {
                            console.log(`Hata: Fonksiyon, ${13 - diffInSeconds.toFixed(2)} saniye sonra çalıştırılabilir.`);
                            return
                        }
                    }
                }

                const data = {
                    message: message.message,
                    id: message.id
                }

                await croxydb.set("function_last_run_time", now)
                await processMessage(data)
            } 
        }
    } catch (err) {
        console.error(err)
    }
}


async function processMessage(message) {
    try {
        const lastNews = await croxydb.get("lastNews");
        if (lastNews.includes(message.id)) return;

        let msg = message.message;
        if (!msg) return

        console.log("Mesaj alındı, işleniyor.");

        const keywords = new Set((await settings.replacedKeyword).map(word => escapeRegExp(word.toLowerCase())));

        keywords.forEach(keyword => {
            msg = msg.replace(new RegExp(keyword, 'gi'), "");
        });
        const regex = /\$[A-Z]{2,}|(?<!\$)[A-Z]{2,}/g;
        let matches = msg.toUpperCase().match(regex);

        const words = msg.trim().split(/\s+/);
        
        words.forEach((word) => {
            const upperWord = word.toUpperCase();
        
            for (const key of Object.keys(stableSymbols)) {
              if (key.split(" ").includes(upperWord)) {
                matches.push(...stableSymbols[key]);
              }
            }
          });

        console.log("Coinler:", matches)

        if (words.length > 2) {
            msg = await ai.translateSummarize(msg);
        }

        if(words.length > 75) return
        console.log(words)
        msg = msg
            .replace(/https?:\/\/\S+/g, "")
            .replace("Bu haberi Türkçeye çevir ve en net ve kısa biçimde yaz", "")
            .replace(/————————————\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, "");

        if (msg.includes("verilen metin anlamlı"
            || msg.includes("belirttiğiniz içeriği çevirip özetleyebilmem")
            || msg.includes("Başka bir konuda yardımcı olabilir")
            || msg.includes("işaretiyle başlayan kelimeleri aynen bırakmam")
            || msg.includes("paylaştığınız bağlantıya erişimim")
        )) {
            await croxydb.push("lastNews", message.id);
            return
        }

        
        const users = await userService.findAll();
        const [trUsers, enUsers, ruUsers, ukUsers] = await Promise.all([
            users.filter(u => u.language === Language.TR && u.subscribe),
            users.filter(u => u.language === Language.EN && u.subscribe),
            users.filter(u => u.language === Language.RU && u.subscribe),
            users.filter(u => u.language === Language.UK && u.subscribe)
        ]);

        bot.sendNews(msg, matches, trUsers, Language.TR);
        bot.sendNews(msg, matches, enUsers, Language.EN);
        bot.sendNews(msg, matches, ruUsers, Language.RU);
        bot.sendNews(msg, matches, ukUsers, Language.UK);

        await processPublicNews(msg)
        await croxydb.push("lastNews", message.id);
    } catch (err) {
        console.error(err);
        log.logMessage(`Error in processMessage ${message} ${err}`)
    }
}

async function processPublicNews(text) {
 
    await new Promise(resolve => setTimeout(resolve, 15000));

    const channel = await client.getEntity(); 

    const impact = await ai.newsCommenting(text)
    const en = await translateText(text, "EN")

    const message = `${text}\n\nYapay Zeka Yorumu: ${impact}\n\nEN: ${en}`

    await client.sendMessage(channel.id, { message: message }) 
    
}


async function translateText(text, targetLanguage) {

    const url = "https://api-free.deepl.com/v2/translate";
    const headers = {
        "Authorization": `DeepL-Auth-Key ${settings.deeplToken}`,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const data = new URLSearchParams();
    data.append('text', text);
    data.append('target_lang', targetLanguage);

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.translations[0].text;
    } catch (error) {
        console.error(`Error: ${error.response.status}, ${error.response.data}`);
        log.logMessage(`Error in translateText function ${text} ${targetLanguage} ${error}`)
        return null;
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
    translateText
}