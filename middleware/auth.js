const { errorResponse } = require("../app/response")
const { verifyToken } = require("../server/auth/auth")

async function handleUserAuthentication(req, res, next) {
    const authToken = req.get("Authorization")
    if (!authToken){
        return errorResponse(res, 401, "user should be logged in")
    }
    const encodedToken = authToken.split("Bearer ")[1]
    try {
        const payload = verifyToken(encodedToken)
        req.user_id = payload.id
        req.plan = payload.plan
        next()
    } catch (error) {
        return errorResponse(res, 401, "session expired! Log in again.")
    }
}

module.exports = {
    handleUserAuthentication
}