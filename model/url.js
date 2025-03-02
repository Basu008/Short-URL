const mongoose = require("mongoose")

// const visitorSchema = new mongoose.Schema({
//     origin:{
//         type:String,
//     },
//     device:{
//         type:String
//     }
// },{
//     timestamps:{
//         createdAt:'created_at',
//         updatedAt:'updated_at',
//     }
// })

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
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at',
    }
})

const URL = mongoose.model('url', urlSchema)

module.exports = URL