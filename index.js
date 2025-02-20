//Packages
const express = require("express")

//Modules
const Config = require("./server/config/config")

//Setting up mongo db
const connectionURL = Config.database.url
const {setupMongoDBConnection} = require("./server/mongodb/mongodb")
setupMongoDBConnection(connectionURL)
    .then(() => {console.log("Connected to MongoDB...")})
    .catch((err) => console.log("Error from MongoDB: ", err))   

//Setting up server
const urlRoutes = require("./routes/url")
const app = express()
app.use(express.json())
app.use(Config.url.baseURL, urlRoutes)
const PORT = Config.server.port
app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})