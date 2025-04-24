const Config = require("./server/config/config")
const {startServer} = require("./server/server")
const {setupMongoDBConnection} = require("./server/mongodb/mongodb")

//Setting up mongo db
setupMongoDBConnection(Config.database)
startServer()