const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/n1")
const plm = require('passport-local-mongoose')

const userSchema = mongoose.Schema ({
  username: String,
  surname: String,
  email: String,
  password: String,
  DOB: Date,
  gender: String,
  bio: {
    type: String,
    default: ""
  },
  post:[{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'post'
  }],
})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);