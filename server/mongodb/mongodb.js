const Config = require("../config/config")
const mongoose = require("mongoose")

async function setupMongoDBConnection(){
    const url = Config.database.url
    const connection = mongoose.connect(url)
            .then(() => {console.log("Connected to MongoDB...")})
            .catch((err) => console.log("Error from MongoDB: ", err))  
    return connection
}

module.exports = {
    setupMongoDBConnection
}