const mongoose = require("mongoose")
const {nanoid} = require("nanoid")
const config = require("../server/config/config")


const urlSchema = new mongoose.Schema({
    short_id:{
        type:String,
        required:true,
        unique:true,
    },
    redirect_url:{
        type:String,
        required:true,
        unique:true,
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at',
    }
})

urlSchema.pre('save', function (next){
    const shortID = generateShortID()
    this.short_id = shortID
    next()
})

const URL = mongoose.model('url', urlSchema)

function generateShortID(){
    return nanoid(config.url.shortIdLength)
}

module.exports = URL