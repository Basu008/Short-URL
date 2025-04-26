const User = require("../model/user")
const { successResponse, errorResponse} = require("./response")
const { signToken } = require("../server/auth/auth")

async function createUser(req, res) {
    const {full_name, username, password, phone} = req.body
    await User.create({
        username,
        password,
        full_name,
        phone
    }).then((result) => {
        return successResponse(res, 201, result._id)
    }).catch((err) => {
        console.log("error creating user: ", err.message)
        errorResponse(res, 500, err.message)
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
    await User.validateUser(username, password).then((user) => {
        user._doc.token = signToken(user)
        return successResponse(res, 200, {...user._doc, password:undefined, __v:undefined})
    }).catch((err) => {
        console.error("Login error:", err.message)
        errorResponse(res, 400, err.message)
    })
}

module.exports = {
    createUser,
    loginUser,
}