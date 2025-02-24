const Config = require("./server/config/config")

//Setting up mongo db
const connectionURL = Config.database.url
const {setupMongoDBConnection} = require("./server/mongodb/mongodb")
setupMongoDBConnection(connectionURL)
    .then(() => {console.log("Connected to MongoDB...")})
    .catch((err) => console.log("Error from MongoDB: ", err))  

//Setting up express
const express = require("express")
const useragent = require("express-useragent")
const app = express()
app.use(express.json())
app.use(useragent.express())

//Setting up server
const { handleUserAuthorisation } = require("./middleware/auth")
const urlRoutes = require("./routes/url")
const userRoutes = require("./routes/user")
app.use(Config.baseURL.url, handleUserAuthorisation, urlRoutes)
app.use(Config.baseURL.user, userRoutes)
const PORT = Config.server.port
app.listen(PORT, () => {console.log(`Started server at localhost:${PORT}`)})