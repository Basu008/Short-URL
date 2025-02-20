//Packages
const express = require("express")

//Modules
const config = require("./server/config/config")

//Setting up mongo db
const connectionURL = config.database.url
const {setupMongoDBConnection} = require("./server/mongodb/mongodb")
setupMongoDBConnection(connectionURL)
    .then(() => {console.log("Connected to MongoDB...")})
    .catch((err) => console.log("Error from MongoDB: ", err))   

const app = express()
const PORT = config.server.port

app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})