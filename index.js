//Packages
const express = require("express")

//Modules
const config = require("./server/config/config")

const app = express()
const PORT = config.server.port

app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})