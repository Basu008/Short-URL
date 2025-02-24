const mongoose = require('mongoose')

const userSessionSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    session_id:{
        type:String,
        required:true
    },
    device:{
        type:String,
        required:true,
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
})

const UserSession = mongoose.model('user_session', userSessionSchema)

module.exports = UserSession