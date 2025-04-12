const URL = require("../model/url")
const Visit = require("../model/visit")
const Config = require("../server/config/config")
const { successResponse, errorResponse, redirectResponse} = require("./response")

const geoip = require('geoip-country');

async function createShortURL(req, res){
    const url = req.body.url
    const userID = req.user_id
    const plan = req.plan
    if (!url){
        return errorResponse(res, 400, "url is a required field")
    }
    if (!isValidUrl(url)){
        return errorResponse(res, 400, "invalid url")
    }
    try {
        const urlCount = await URL.countDocuments({user_id:userID})
        if (urlCount >= Config.url.freeLimit && plan === "FREE"){
            return errorResponse(res, 400, "conversion limit exhausted. Upgrade to premium")
        }
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
    try {
        const result = await URL.create({
            short_id:"id",
            redirect_url: url,
            user_id: userID,
        })
        return successResponse(res, 201, result.short_id)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

async function originalURL(req, res){
    const shortID = req.params.shortID
    const origin = getCountryFromRequest(req)
    const device = req.device.type
    if (!shortID){
        return errorResponse(res, 400, "short id missing")
    }
    try {
        const url = await URL.findOne({short_id:shortID})
        if (!url){
            return errorResponse(res, 400, "short url doesn't exists")
        }
        if (url.is_deleted){
            return errorResponse(res, 400, "short url deleted")
        }
        await Visit.create({
            short_id: shortID,
            user_id:url.user_id,
            origin,
            device
        })
        redirectResponse(res, url.redirect_url)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

async function getAllURLs(req, res){
    const userID = req.user_id
    const page = parseInt(req.query.page) || 0
    const limit = Config.app.pageLimit
    var skip = 0
    if (page > 0){
        skip = page * limit
    }
    try{
        const urls = await URL.find({
            user_id:userID,
            is_deleted:false
        }).skip(skip).limit(limit)
        return successResponse(res, 200, urls)
    }catch(error){
        return errorResponse(res, 500, error.message)
    }
}

async function getURLsCount(req, res){
    const userID = req.user_id
    try {
        const count = await URL.countDocuments({
            user_id:userID
        })
        return successResponse(res, 200, count)
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

async function deleteURL(req, res){
    const userID = req.user_id
    const shortID = req.params.shortID
    const url = `${req.hostname}/${shortID}`
    URL.updateOne(
        {user_id:userID,short_id:shortID},
        {$set:{is_deleted:true}}
    ).then(result => {
        if (result.matchedCount == 0){
            return errorResponse(res, 400, `${url} doesn't exists`)
        }else if (result.modifiedCount == 0){
            return errorResponse(res, 400, `${url} already deleted`)
        }
        else {
            return successResponse(res, 200, `successfully deleted ${url}`)
        }
    }).catch(err => {
        return errorResponse(res, 500, err.message)
    })
}

function getCountryFromRequest(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'Unknown';
}

function isValidUrl(url) {
    const regex = /^(https?:\/\/)[\w.-]+\.[a-z]{2,}([/?].*)?$/i;
    return regex.test(url);
}

module.exports = {
    createShortURL,
    originalURL,
    getAllURLs,
    getURLsCount,
    deleteURL
}