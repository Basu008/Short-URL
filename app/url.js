const URL = require("../model/url")
const Visit = require("../model/visit")
const Config = require("../server/config/config")
const { successResponse, errorResponse, redirectResponse} = require("./response")


async function createShortURL(req, res){
    if (!req.user_id){
        return errorResponse(res, 401, "user not logged in")
    }
    const url = req.body.url
    if (!url){
        return errorResponse(res, 400, "url is a required field")
    }
    const result = await URL.create({
        short_id:"id",
        redirect_url: url,
        user_id: req.user_id,
    })
    return successResponse(res, 201, result.short_id)
}

async function originalURL(req, res){
    const shortID = req.params.shortID
    const origin = req.query.origin
    const device = req.query.device
    if (!shortID){
        return errorResponse(res, 400, "short id missing")
    }
    const url = await URL.findOne({short_id:shortID})
    await Visit.create({
        short_id: shortID,
        user_id:url.user_id,
        origin,
        device
    })
    redirectResponse(res, url.redirect_url)
}

// async function linkAnalytics(req, res){
//     const shortID = req.params.shortID
//     if (!shortID){
//         return errorResponse(res, 400, "id is a required field")
//     }
//     const result = await URL.findOne({
//         short_id:shortID,
//         user_id:req.user_id
//         })
//     const responseBody = {
//         total_clicks: result.visit_history.length,
//         click_timestamps:result.visit_history
//     }
//     return successResponse(res, 200, responseBody)
// }

// async function getLinkCounts(req, res){
//     const count = await URL.countDocuments({user_id:req.user_id})
//     return successResponse(res, 200, count)
// }

async function getAllURLs(req, res){
    if (!req.user_id){
        return errorResponse(res, 401, "user not logged in")
    }
    const page = Number(req.query.page)
    const limit = Config.app.pageLimit
    const skip = 0
    if (page > 0){
        skip = page * limit
    }
    const urls = await URL.find({
        user_id:req.user_id
    }).skip(skip).limit(limit)
    return successResponse(res, 200, urls)
}

module.exports = {
    createShortURL,
    originalURL,
    // linkAnalytics,
    getAllURLs,
    // getLinkCounts
}