const mongoose = require('mongoose')

var Schema=mongoose.Schema


const passschema =new Schema({
    username:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }


})

const Passmodel = mongoose.model('passmodel', passschema)
module.exports = Passmodel