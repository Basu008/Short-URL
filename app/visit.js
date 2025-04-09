const Config = require("../server/config/config")
const Visit = require("../model/visit")
const { successResponse, errorResponse} = require("./response")

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

async function getVisitsCount(req, res) {
    const userID = req.user_id
    try {
        const filter = {
            user_id:userID
        }
        const count = await Visit.countDocuments(filter)
        return successResponse(res, 200, count)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

async function getVisits(req, res){
    const page = parseInt(req.query.page) || 0
    const origin = String(req.query.origin)
    const device = String(req.query.device)
    const limit = Config.app.pageLimit
    const userID = req.user_id
    var skip = 0
    if (page > 0){
        skip = page * limit
    }
    try {
        const filter = {
            user_id:userID
        }
        if (device != 'undefined'){
            filter.device = device
        }
        if (origin != 'undefined'){
            filter.origin = origin
        }
        const visits = await Visit.find(filter).skip(skip).limit(limit)
        return successResponse(res, 200, visits)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

async function getURLVisits(req, res){
    const page = parseInt(req.query.page) || 0
    const origin = String(req.query.origin)
    const device = String(req.query.device)
    const limit = Config.app.pageLimit
    const userID = req.user_id
    const shortID = req.params.shortID
    var skip = 0
    if (page > 0){
        skip = page * limit
    }
    try {
        const filter = {
            user_id:userID,
            short_id:shortID
        }
        if (device != 'undefined'){
            filter.device = device
        }
        if (origin != 'undefined'){
            filter.origin = origin
        }
        const visits = await Visit.find(filter).skip(skip).limit(limit)
        return successResponse(res, 200, visits)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

async function getURLVisitsCount(req, res) {
    const userID = req.user_id
    const shortID = req.params.shortID
    try {
        const filter = {
            user_id:userID,
            short_id:shortID
        }
        const visits = await Visit.countDocuments(filter)
        return successResponse(res, 200, visits)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

module.exports = {
    addURLVisit,
    getVisits,
    getURLVisits,
    getURLVisitsCount,
    getVisitsCount
}
