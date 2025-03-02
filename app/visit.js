const Visit = require("../model/visit")
// const { successResponse, errorResponse} = require("./response")

async function addURLVisit(short_id, origin, device){
    try{
        await Visit.create({
            short_id, origin, device
        })
        return true
    }catch(err){
        throw new Error(err)
    }
}

module.exports = {
    addURLVisit
}
