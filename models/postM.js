const mongoose = require('mongoose')
const dompurifier=require('dompurify')
const { JSDOM }=require('jsdom')
const htmlPurify=dompurifier(new JSDOM().window)

// const stripHtml=require('string-strip-html');

var Schema=mongoose.Schema

/*Zaroorat hi nahi pada*/

const commentSchema=new Schema({
    username:String,
    cmnt:String,
    time:Date
})



const postschema =new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    // snippet:{
    //     type:String
    // },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    img:{
        type:String,
        // default:"default.jpg"
    }
    ,
    comment: [commentSchema]


})

postschema.pre('validate',(next)=>{
    if(this.desc){
        this.desc=htmlPurify.sanitize(this.desc)
        // this.snippet=stripHtml(this.desc.substring(0,150)).result
    }
    next();
})

const Postmodel=module.exports = mongoose.model('postmodel', postschema)
// const Commentmodel=module.exports=mongoose.model ('commentmodel',commentSchema)