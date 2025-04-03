const Config = require("../server/config/config")
const { successResponse} = require("../app/response")

const { handleUserAuthentication } = require("../middleware/auth")
const urlRoutes = require("./url")
const redirectionRoutes = require("./redirection")
const userRoutes = require("./user")
const visitsRoutes = require("./visits")

function setUpRoutes(app){
    app.use(Config.baseURL.url, handleUserAuthentication, urlRoutes)
    app.use(Config.baseURL.redirection, redirectionRoutes)
    app.use(Config.baseURL.user, userRoutes)
    app.use(Config.baseURL.visits,handleUserAuthentication, visitsRoutes)
}

function setUpHealthCheck(app){
    app.get("/health-check", createUser)
}

function createUser(req, res) {
    return successResponse(res, 200, true)
}

module.exports = {
    setUpRoutes,setUpHealthCheck
}