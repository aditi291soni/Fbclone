const mongoose = require('mongoose')


const blogSchema = mongoose.Schema({
    title: String,
    para: String,
    location: String,
    postImage: {
        type: String,
        default: "../image/defaut.jpg"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'user'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },


})

module.exports = mongoose.model('post', blogSchema); 