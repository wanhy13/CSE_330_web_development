let mongoose = require('mongoose');

//post schema
let postSchema = mongoose.Schema({
    author:{
        type: String,
        required: true
    },
    authorname:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true
    },
    photo:{
        type:String
    },
    likelist:[String]
});
let post = module.exports = mongoose.model('Post',postSchema)