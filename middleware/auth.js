const { errorResponse } = require("../app/response")
const { getUserID } = require("../app/user_session")

async function handleUserAuthentication(req, res, next) {
    const sessionID = req.get("Authorization")
    if (!sessionID){
        return errorResponse(res, 401, "user should be logged in")
    }
    getUserID(sessionID).then((userID) => {
        if (!userID){
            return errorResponse(res, 401, "session timed out! Log in again")
        }else{
            req.user_id = userID
            return next()
        }
    })
}

module.exports = {
    handleUserAuthentication
}