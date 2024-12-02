const { User, Language } = require('../models/user');
const languages = require('../language/languages');
const languageService = require('./languageService');
const { subscribe } = require('../language/tr');
const log = require('../log')

async function createUser(telegramId, language) {
    try {
        const existUser = await User.existTelegramId(telegramId);

        if (existUser) {
            return "Bu telegram id ile mevcut bir kullanıcı var";
        }

        await User.create({
            telegramId,
            language: Language.EN,
        });
        log.logMessage(`${telegramId} Kayıt oldu`)
        return "Kullanıcı oluşturuldu";
    } catch (error) {
        console.error(error);
        log.logMessage(`Error in createUser function ${telegramId} ${error}`)
        return "Bir hata oluştu";
    }
}

async function findByUserId(userId) {
    const user = await User.findById(userId);
    return user ? user.dataValues : null;
}

async function findByTelegramId(userId) {
    const user = await User.findByTelegramId(userId);
    return user ? user.dataValues : null;
}

async function findAll() {
    const users = await User.findAll();
    return users.map(usr => usr.dataValues);
}

async function findByReferenceCode(code) {
    const user = await User.findByReferenceCode(code)
    if(!user) return null
    return await user.dataValues
}

async function updateUserLangueage(telegramId, language) {
    try {

        const updatedUser = await User.update(
            { language: Language[language] },
            { where: { telegramId: telegramId } }
        );

        const messages = await languageService.getLanguage(telegramId);

        if (updatedUser[0] === 1) {
            return messages.success0001
        } else {
            return messages.error0001
        }

    } catch (error) {
        console.log(error)
        log.logMessage(`Error in updateUserLanguage function ${telegramId} ${language} ${error}`)
        return messages.error0002;
    }
}

async function controlSubs() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    while (true) {
        const users = await findAll()

        for (user of users) {
            let messages = await languageService.getLanguage(user.telegramId)
            if (user.subscriptionEnd != null) {
                const specifiedDate = new Date(user.subscriptionEnd);
                const currentDate = new Date();

                if (specifiedDate < currentDate) {
                    await User.update(
                        { subscriptionEnd: null, subscribe: false },
                        { where: { id: user.id } }
                    );
                    
                    log.logMessage(`${user.id} Kullanıcının aboneliği sonlandı`)
                    require("../telegramBot/bot").sendMessage(user.telegramId, messages.endSub)
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}
controlSubs()
module.exports = {
    createUser,
    updateUserLangueage,
    findByUserId,
    findAll,
    findByTelegramId,
    findByReferenceCode
};
