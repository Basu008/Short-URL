const User = require("../model/user")
const bcrypt = require("bcrypt")
const { successResponse, errorResponse} = require("./response")
const { createSessionID } = require("./user_session")

async function createUser(req, res) {
    const {username, password} = req.body
    if (!username){
        return errorResponse(res, 400, "username is a required field")
    }
    if (!password){
        return errorResponse(res, 400, "password is a required field")
    }
    if (!isUsernameValid(username)){
        return errorResponse(res, 400, "not a valid username")
    }
    if (!isPasswordValid(password)){
        return errorResponse(res, 400, "password is not strong enough")
    }
    hashPassword(password).then(async (encryptedPassword) => {
        const result = await User.create({
                user_name:username,
                password: encryptedPassword
            })
        return successResponse(res, 201, result._id)
    })
}

async function loginUser(req, res) {
    const {username, password} = req.body
    if (!username){
        return errorResponse(res, 400, "username is a required field")
    }
    if (!password){
        return errorResponse(res, 400, "password is a required field")
    }
    const user = await User.findOne({
        user_name: username
    })
    if (!user){
        return errorResponse(res, 400, "invalid username")
    }
    verifyPassword(password, user.password).then((isVerified) => {
        if (isVerified){
            const ua = req.useragent
            const device = ua.isMobile ? "Mobile" : ua.isTablet ? "Tablet" : "Desktop"
            createSessionID(user._id, device).then((sessionID) => {
                if (sessionID === ""){
                    return errorResponse(res, 400, "unable to login please try again")
                }
                return successResponse(res, 200, sessionID)
            })
        }else{
            return errorResponse(res, 400, "incorrect password")
        }
    })
}

//Helper functions
function isUsernameValid(username){
    const regex = /^[a-zA-Z0-9@._]{5,30}$/
    return regex.test(username)
}

function isPasswordValid(password){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(password)
}

async function hashPassword(password){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function verifyPassword(inputPassword, hashedPassword ){
    return await bcrypt.compare(inputPassword, hashedPassword)
}

module.exports = {
    createUser,
    loginUser
}