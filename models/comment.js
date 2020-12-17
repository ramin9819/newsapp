const mongoose = require('mongoose');



const commentSchema = new mongoose.Schema({
    //TODO  : add like
    content: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required:true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: "geust"
    } 
}, { timestamps: true });


module.exports = mongoose.model('Comment', commentSchema)