const { User, Language } = require('../models/user');
const userService = require('./userService')
const { Market, markets } = require('../models/market')
const languageService = require('./languageService')
const log = require('../log')
async function saveMarket(userId, market, apiKey, secretKey) {
    try {
        
        const user = await userService.findByUserId(userId);
        const messages = await languageService.getLanguage(user.telegramId);

        const existingMarket = await Market.findOne({
            where: {
                UserId: userId,
            },
        });

        if (existingMarket) {

            existingMarket.market = market;
            existingMarket.apiKey = apiKey;
            existingMarket.secretKey = secretKey;
            
            await existingMarket.save();
            log.logMessage(`${userId} Borsaya kayıt oldu borsa: ${market}`)
            return messages.success0005;
        } else {

            const newMarket = await Market.create({
                UserId: userId,
                market: market,
                apiKey: apiKey,
                secretKey: secretKey,
            });
            log.logMessage(`${userId} Borsaya kayıt oldu borsa: ${market}`)
            return messages.success0005;
        }
    } catch (error) {
        console.error(error);
        log.logMessage(`Error in saveMarket function ${userId} ${error}`)
        return messages.error0003
    }
}

async function findByUserId(userId) {
    const userMarket = await Market.findByUserId(userId)
    if(userMarket) {
        return userMarket.dataValues
    }
    return null
}

async function existUserId(userId) {
    const userMarket = Market.findByUserId(userId)
    if(userMarket) {
        return true
    }
    return false
}

module.exports = { 
    saveMarket ,
    findByUserId
}