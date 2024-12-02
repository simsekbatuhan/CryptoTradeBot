
const tokenService = require('../services/tokenService')

exports.login = async (req, res) => {
    try {
        const id = req.query.id
        const request = await tokenService.login(id)
        res.json(await {message: request})
    } catch(err){
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
}

exports.loginByCode = async (req, res) => {
    try {
        const id = req.query.id
        const code = req.query.code

        const request = await tokenService.loginByCode(id, code)
        
        res.json(await request)
    } catch(err){
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
}