const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
}, {
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User