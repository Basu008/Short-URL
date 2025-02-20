const mongoose = require("mongoose")

async function setupMongoDBConnection(url){
    return mongoose.connect(url)
}

module.exports = {
    setupMongoDBConnection
}