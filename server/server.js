const Config = require("../server/config/config")
const {setUpRoutes} = require("../routes/routes")

const express = require("express")
const useragent = require("express-useragent")

const PORT = Config.server.port

function startServer(){
    const app = express()
    app.use(express.json())
    app.use(useragent.express())
    setUpRoutes(app)
    app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})
}

module.exports = {
    startServer
}