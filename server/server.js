const Config = require("../server/config/config")
const {setUpRoutes, setUpHealthCheck} = require("../routes/routes")

const express = require("express")
const device = require('express-device')

const PORT = Config.server.port

function startServer(){
    const app = express()
    app.use(express.json())
    app.use(device.capture())
    setUpRoutes(app)
    setUpHealthCheck(app)
    app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})
}

module.exports = {
    startServer
}