const settings = require('../config/settings')
const { References } = require('../models/reference')
const { User } = require('../models/user') 
const languageService = require('./languageService')
const log = require('../log')
async function createReferenceCode(user) {
    if(user.referenceCode != null) {
        return user.referenceCode
    }
    return await User.createReferanceCode(user)
}


async function userTotalEarned(userId) {
    const user = await require('./userService').findByTelegramId(userId)

    const references = await References.findAll({
        where: {
            referanceOwner: user.id
        }
    })
    
    var total = 0
    for(reference of references) {
        total+= reference.dayEarned
    }
    return total
}

async function findByUser(userId) {
    const getUser = await require('./userService').findByTelegramId(userId)
    const user = await References.findByUserId(getUser.id)
    if(await !user) return null
    return user.dataValues
}

async function findByUserId(userId){
    const user = await References.findByUserId(userId)
    if(await !user) return null
    return user.dataValues
}

async function hasReferance(userId) {
    const user = await References.findByUserId(userId)
    if(await !user) return false
    return true
}

async function getReferanceCode(userId) {
    const getUser = await require('./userService').findByTelegramId(userId)
    const user = await References.findByUserId(getUser.id)
    if(await !user) return null
    return await user.dataValues.code
}

async function countRefUsers(telegramId) {
    const user = await require('./userService').findByTelegramId(telegramId)

    const references = await References.findAllByReferenceOwner(user.id)
    return await references.length
}

async function countRefByUserId(userId) {
    const references = await References.findAllByReferenceOwner(userId)
    return await references.length
}

async function joinReference(userId, code) {

    const messages = await languageService.getLanguage(userId)

    const user = await require('./userService').findByTelegramId(userId)
    if(!user) return messages.userNotFound

    const referenceUser = await require('./userService').findByReferenceCode(code)
    
    if(await hasReferance(user.id)) return messages.error00013
    if(!referenceUser) return messages.error00014
    if(user.referenceCode == code) return messages.error00014
    
    const joinReferance = await References.create({
        code: code,
        userId: user.id,
        referanceOwner: referenceUser.id,
        dayEarned: 0
    }) 

    return messages.success0004
}

module.exports = {
    createReferenceCode,
    joinReference,
    getReferanceCode,
    findByUser,
    countRefUsers,
    findByUserId,
    countRefByUserId,
    userTotalEarned
}