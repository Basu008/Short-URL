const mongoose = require('mongoose')
const { createHmac } = require('node:crypto');
const Config = require("../server/config/config.js")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        match:/^[a-zA-Z0-9@._]{5,30}$/,
    },
    password:{
        type:String,
        required:true,
        match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },
    full_name:{
        type:String,
        required:true,
    },
    plan:{
       type:String,
       enum:["FREE","PREMIUM"],
       default:"FREE" 
    },
    phone: {
        country_code: {
            type: String,
            required: true,
            match: /^\+\d{1,4}$/
        },
        number: {
            type: String,
            required: true,
            match: /^\d{6,14}$/
        }
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