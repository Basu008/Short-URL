const mongoose = require('mongoose')
const { createHmac } = require('node:crypto');
const Config = require("../server/config/config.js")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    full_name:{
        type:String,
        required:true,
    },
    plan:{
       type:String,
       enum:["FREE","PREMIUM"],
       default:"FREE" 
    }
}, {
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
})

userSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified("password")) return
    const hashedPassword = createHmac('sha256', Config.app.secretKey)
               .update(user.password)
               .digest('hex');
    this.password = hashedPassword
    next()
})

userSchema.static('validateUser', async function(username,passoword){
    const user = await this.findOne({username})
    if (!user) throw new Error('incorrect username')
    const hashedPassword = user.password
    const hashedGivenPassword = createHmac('sha256', Config.app.secretKey)
        .update(passoword)
        .digest('hex')
    if (hashedGivenPassword !== hashedPassword) throw new Error('incorrect passoword')
    return user
})

const User = mongoose.model('user', userSchema)

module.exports = User