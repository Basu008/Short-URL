const Config = require("../config/config")
const mongoose = require("mongoose")
const dbConfig = Config.database

async function setupMongoDBConnection(){
    const connection = mongoose.connect(getConnectionURL())
            .then(() => {console.log("Connected to MongoDB...")})
            .catch((err) => console.log("Error from MongoDB: ", err))  
    return connection
}

function getConnectionURL(){
    const url = `${dbConfig.scheme}${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.dbname}`
    console.log(url);
    return url
}

module.exports = {
    setupMongoDBConnection
}