var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./blog');
const commentModel = require('./comments');
const fs = require('fs');


const passport = require('passport');
const passportLocal = require('passport-local');
passport.use(new passportLocal(userModel.authenticate()))


const multer = require('multer');
const blog = require('./blog');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + file.originalname)
  }
})


const upload = multer({ storage: storage })




/* GET home page. */

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/showcmt', function (req, res) {
  commentModel.find()
    .then(function (lol) {
      res.send(lol)
    })
});

router.post('/comment/:id', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (User) {
      postModel.findOne({ _id: req.params.id })
        .then(function (data) {
          commentModel.create({
            comment: req.body.comment,
            cmtuser: User.username,
            postid: data._id
          })
            .then(function (com) {
              data.comments.push(com)
              data.save()
                .then(function () {
                  res.redirect('/profile')
                })
            })
        })
    })
});

router.get('/profile', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (User) {
      postModel.find()
        .populate('user')
        .populate('comments')
        .then(function (data) {
          res.render('newuser', { User, data })
          console.log(data);

        })
    })
});


router.post('/savechanges', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (val) {
      val.bio = req.body.bio
      val.save()
        .then(function (data) {
          res.redirect('back');
        })
    })
});


router.get('/myposts', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .populate('post')
    .then(function (val) {
      res.render('mypost', { val });
    })

});


router.get('/likes/:id', function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      postModel.findOne({ _id: req.params.id })
        .then(function (foundPost) {
          if (foundPost.likes.indexOf(foundUser._id) === -1) {
            foundPost.likes.push(foundUser._id)
          }
          else {
            foundPost.likes.splice(foundPost.likes.indexOf(foundUser._id), 1)
          }
          foundPost.save()
            .then(function (data) {
              res.redirect('back')
            })
        })
    })
});








router.post('/post', isLoggedIn, upload.single('postImage'), function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (val) {
      postModel.create({
        title: req.body.title,
        para: req.body.para,
        postImage: req.file.filename,
        location: req.body.location,
        user: val
      })
        .then(function (vala) {
          val.post.push(vala)
          val.save()
            .then(function () {
              res.redirect('/profile')
            })
        })
    })
});



router.get('/delete/comment/:id', function (req, res) {
  commentModel.findOneAndDelete({ _id: req.params.id })
    .then(function (data) {
      res.redirect('back')
    })
});
router.get('/delete/:id', function (req, res) {
  postModel.findOneAndDelete({ _id: req.params.id })
    .then(function (data) {
      // console.log(data.postImage);
      fs.unlink(`./public/images/${data.postImage}`, (err => {
        if (err) console.log(err);
        else {
          res.redirect('/myposts')
        }
      }));

    })
});


router.get('/update/:id', function (req, res) {
  postModel.findOne({ _id: req.params.id })
    .then(function (data) {
      res.render('update', { data })
    })
});


router.post('/updated/:id', upload.single('postImage'), function (req, res) {
  postModel.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, para: req.body.para, postImage: req.file.filename })
    .then(function (dat) {
      res.redirect('/myposts')
    })
});


router.get('/users', async function (req, res) {
  const val = await userModel.find()
  res.send(val)
});



router.post('/register', function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,
    surname: req.body.surname,
    email: req.body.email,
    DOB: req.body.date,
    gender: req.body.gender
  })
  userModel.register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile')
      })
    })
    .catch(function (e) {
      res.send(e)
    })
});


router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/profile',
    failureRedirect: '/'
  }),
  function (req, res) { });

router.get('/logout', function (req, res,next) {
  req.logout()
  res.redirect('/')
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.redirect('/')
  }
}



module.exports = router;
