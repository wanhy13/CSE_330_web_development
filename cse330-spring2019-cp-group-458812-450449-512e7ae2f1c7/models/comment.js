let mongoose = require('mongoose');

//post schema
let commentSchema = mongoose.Schema({
    author:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true
    },
    authorname:{
        type:String,
        required:true
    },
    postid:{
        type:String,
        required:true
    }
});
let comment = module.exports = mongoose.model('Comment',commentSchema)