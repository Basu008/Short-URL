const URL = require("../model/url")
const Visit = require("../model/visit")
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

async function originalLink(req, res){
    const shortID = req.params.shortID
    const origin = req.query.origin
    const device = req.query.device
    if (!shortID){
        return errorResponse(res, 400, "short id missing")
    }
    const url = await URL.findOne({short_id:shortID})
    const visitCreated = await Visit.create({
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

async function getAllLinks(req, res){
    const urls = await URL.find({
        user_id:req.user_id
    })
    return successResponse(res, 200, urls)
}

module.exports = {
    createShortURL,
    originalLink,
    // linkAnalytics,
    getAllLinks,
    // getLinkCounts
}