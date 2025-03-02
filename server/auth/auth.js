const Config = require('../config/config')
const JWT = require("jsonwebtoken")

const secret = Config.app.jwtSecret

function signToken(user){
    const payload = {
        id:user._id,
        plan:user.plan
    }
    const token = JWT.sign(payload, secret)
    return Buffer.from(token).toString("base64")
}

function verifyToken(encodedToken){
    const token = Buffer.from(encodedToken, "base64").toString("utf-8")
    const payload = JWT.verify(token, secret)
    return payload
}

module.exports = {
    signToken, verifyToken
}