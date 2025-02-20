const config = require("../server/config/config")
const URL = require("../model/url")
const {nanoid} = require("nanoid")
const { successResponse, errorResponse, redirectResponse} = require("./response")


async function createShortURL(req, res){
    const url = req.body.url
    if (!url){
        return errorResponse(res, 400, "url is a required field")
    }
    const shortID = generateShortID()
    const result = await URL.create({
        short_id: shortID,
        redirect_url: url,
    })
    return successResponse(res, 201, result.short_id)
}

async function originalLink(req, res){
    const shortID = req.params.shortID
    if (!shortID){
        return errorResponse(res, 400, "short id missing")
    }
    const entry = await URL.findOneAndUpdate(
        {
            short_id:shortID
        },{
            $push:{
                visit_history:Date.now()
            }
        })
    redirectResponse(res, entry.redirect_url)
}

async function linkAnalytics(req, res){
    const shortID = req.params.shortID
    if (!shortID){
        return errorResponse(res, 400, "id is a required field")
    }
    const result = await URL.findOne({short_id:shortID})
    const responseBody = {
        total_clicks: result.visit_history.length,
        click_timestamps:result.visit_history
    }
    return successResponse(res, 200, responseBody)
}

function generateShortID(){
    return nanoid(config.url.shortIdLength)
}

module.exports = {
    createShortURL,originalLink,linkAnalytics
}