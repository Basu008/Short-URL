const Config = require("./server/config/config")

//Setting up mongo db
const connectionURL = Config.database.url
const {setupMongoDBConnection} = require("./server/mongodb/mongodb")
setupMongoDBConnection(connectionURL)
    .then(() => {console.log("Connected to MongoDB...")})
    .catch((err) => console.log("Error from MongoDB: ", err))  

const express = require("express")
const app = express()
app.use(express.json()) 

//Setting up server
const urlRoutes = require("./routes/url")
const userRoutes = require("./routes/user")
app.use(Config.baseURL.url, urlRoutes)
app.use(Config.baseURL.user, userRoutes)
const PORT = Config.server.port
app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})