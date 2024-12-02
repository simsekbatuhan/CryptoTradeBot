
const userService = require('../services/userService')

exports.findByUserId = async (req, res) => {
    try {
        const userId = req.query.userId

        if (!userId) return res.json({ message: "Eksik bilgi" })

        const response = await userService.findByUserId(userId)

        res.json(await response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getAll = async (req, res) => {
    try {
        const response = await userService.findAll()
        res.json(await response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getUserStatics = async (req, res) => {
    try {
        const telegramId = await req.query.telegramId
        if(!telegramId) return res.json({message: "Lütfen kullanıcının telegram id'sini belirtiniz."})
        const response = await userService.getUserStatics(telegramId)
        res.json(await response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getStatics = async (req, res) => {
    try {
        const response = await userService.getStatics()
        res.json(await response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.updateBalanceAndMainBalance = async (req, res) => {
    try {
        const telegramId = await req.query.telegramId
        const balance = req.query.balance
        const mainBalance = req.query.mainBalance

        if(!telegramId) return res.json({message: "Lütfen kullanıcının telegram id'sini belirtiniz."})
        const response = await userService.updateBalanceAndMainBalance(mainBalance, balance, telegramId)
        res.json(await {message: response})
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.findChars = async (req, res) => {
    try {
        const chars = req.query.chars
        var response;
        if (!chars) {
             response = await userService.findAll()
        } else {
             response = await userService.findChars(chars)
        }
        res.json(await response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}