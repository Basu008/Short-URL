const mongoose = require("mongoose")

async function setupMongoDBConnection(dbConfig){
    const connection = mongoose.connect(getConnectionURL(dbConfig))
            .then(() => {console.log("Connected to MongoDB...")})
            .catch((err) => console.log("Error from MongoDB: ", err))  
    return connection
}

function getConnectionURL(dbConfig){
    const url = `${dbConfig.scheme}${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.dbname}`
    console.log(url);
    return url
}

async function closeMongoConnection(){
    mongoose.disconnect()
}

module.exports = {
    setupMongoDBConnection,
    closeMongoConnection
}