const mongoose = require("mongoose")

const visitSchema = new mongoose.Schema({
    short_id:{
        type:String,
        ref:'url',
        index:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'url',
    },
    origin:{
        type:String,
    },
    device:{
        type:String
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at',
    }
})

const Visit = mongoose.model('visit', visitSchema)

module.exports = Visit