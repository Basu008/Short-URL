const User = require("../model/user")
const { successResponse, errorResponse} = require("./response")
const { signToken } = require("../server/auth/auth")

async function createUser(req, res) {
    const {full_name, username, password} = req.body
    if (!full_name){
        return errorResponse(res, 400, "full_name is a required field")
    }
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
    const result = await User.create({
        username,
        password,
        full_name,
    })
    // The passoword is hashed -> check ./model/user.js
    return successResponse(res, 201, result._id)
}

async function loginUser(req, res) {
    const {username, password} = req.body
    if (!username){
        return errorResponse(res, 400, "username is a required field")
    }
    if (!password){
        return errorResponse(res, 400, "password is a required field")
    }
    User.validateUser(username, password).then((user) => {
        token = signToken(user)
        user._doc.token = token
        return successResponse(res, 200, {...user._doc, password:undefined})
    }).catch((err) => errorResponse(res, 400, err.message))
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


module.exports = {
    createUser,
    loginUser
}