const settings = require('../config/settings')
const { Token } = require('../models/token')
const { User } = require('../models/user')
const crypto = require('crypto');


async function login(id) {
    try {
        console.log(id)
        console.log(settings.ownerIds)
        if (!settings.ownerIds.includes(`${id}`)) return "Bu hesap yeterli yetkiye sahip değil"
        
        const code = await createCode()
        const user = await User.findByTelegramId(id)
        const token = await Token.findByUserId(user.id)


        var currentDate = new Date();
        var futureDate = new Date(currentDate.getTime() + (60 * 60 * 1000));

        if (!token) {
            const createToken = await Token.create({
                code: code,
                UserId: user.id,
                expireDate: futureDate.toString(),
                createdAt: currentDate.toString()
            })

            await require('../telegramBot/bot').sendMessage(id, `Hesabınıza giriş yapmak için gerekli kod: ${code}`)
            return "Güvenlik kodunuz başarıyla telegram kanalınıza iletildi."
        }

        const expireDate = Date.parse(token.expireDate)

        const tokenPk = await Token.findByPk(token.id)

        tokenPk.expireDate = futureDate.toString()
        tokenPk.code = code
        tokenPk.save()

        await require('../telegramBot/bot').sendMessage(id, `Hesabınıza giriş yapmak için gerekli kod: ${code}`)
        return "Güvenlik kodunuz başarıyla telegram kanalınıza iletildi."


    } catch (error) {
        console.log(error)
        return "Bir hata oluştu"
    }
}

async function loginByCode(id, code) {
    if (!settings.ownerIds.includes(`${id}`)) return "Bu hesap yeterli yetkiye sahip değil"

    const user = await User.findByTelegramId(id)
    const token = await Token.findByUserId(user.id)

    if (!token) return { message: "Böyle bir giriş isteği bulunmuyor" }

    var currentDate = new Date();
    const expireDate = Date.parse(token.expireDate)

    if (expireDate < currentDate) return { message: "Bu kodun süresi geçmiş" }
    if (code != token.code) return { message: "Hatalı kod" }

    const generateToken = await generateSecureUUID()
    console.log(generateToken)
    const tokenPk = await Token.findByPk(token.id)
    tokenPk.code = null;
    tokenPk.token = await generateToken.toString()

    tokenPk.save()

    return { message: "Başarıyla giriş yaptınız panele yönlendiriliyorsunuz", token: generateToken.toString() }
}

async function isExpired(tok) {
    try {
        if(!tok) return false;
        const token = await Token.findByToken(tok)
        if (!token) return false;

        var currentDate = new Date();
        const expireDate = Date.parse(token.dataValues.expireDate)

        if (expireDate < currentDate) {
            return false;
        }
        return true;
    } catch (err) {
        console.log(err)
        return false
    }
}

async function createCode() {
    const min = 100000;
    const max = 999999;
    return await Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSecureUUID() {
    return crypto.randomBytes(16).toString('hex');
}


module.exports = {
    login,
    loginByCode,
    isExpired
}