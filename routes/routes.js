const Config = require("../server/config/config")

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

module.exports = {
    setUpRoutes
}