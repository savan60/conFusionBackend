var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
const authenticate = require('../authenticate');
router.use(bodyParser.json());
const cors = require('./cors');

/* GET users listing. */
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log("here users is ", users);
      return next(err);
    }
    res.statusCode = 200;
    res.setHeader('Content_type', 'application/json');
    res.json(users);
  });
});

router.post('/signup', cors.corsWithOptions, function (req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
      next(err);
    }
    else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ status: 'Registration Successful!', success: true });
        });
      });
    }
  });
});


router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: 'You are Successfully LoggedIn!', success: true, token: token });
});

router.get('/logout', cors.cors, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error("You are not logged in");
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token')
  , (req, res, next) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user_id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'You are Successfully LoggedIn!', success: true, token: token });
    }
  });
module.exports = router;
