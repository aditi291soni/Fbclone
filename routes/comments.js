const mongoose = require('mongoose')


const commentSchema = mongoose.Schema({
    comment: String,
    cmtuser: {
        type: String
    },
    postid: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

module.exports = mongoose.model('comments', commentSchema); 