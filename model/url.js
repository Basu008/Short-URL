const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    short_id:{
        type:String,
        required:true,
        unique:true,
    },
    redirect_url:{
        type:String,
        required:true,
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    visit_history:{
        type:[Date],
        default:[]
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at',
    }
})

const URL = mongoose.model('url', urlSchema)

module.exports = URL