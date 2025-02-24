const { v4: uuidv4} = require("uuid")
const UserSession = require("../model/user_session")
const useragent = require("express-useragent")

async function createSessionID(userID, device){
    const sessionID = uuidv4()
    try {
        const result = await UserSession.create({
            user_id:userID,
            session_id:sessionID,
            device:device
        })
        return sessionID
    } catch (error) {
        console.log(error.message);
        return ""
    }
}

async function getUserID(sessionID){
    const session = await UserSession.findOne({
        session_id:sessionID
    })
    if (!session){
        return null
    }
    return session.user_id
}

module.exports = {
    createSessionID,
    getUserID
}