var express = require('express');
var router = express.Router();
const bodyParser=require('body-parser');
var User=require('../models/user');
var passport=require('passport');
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res,next){
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode=500;
       res.setHeader('Content-Type','application/json');
      res.json({err:err});
      next(err);
    }
    else{
      passport.authenticate('local')(req,res,()=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({status:'Registration Successful!',success:true});
      });
    }
  });
});


router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json({status:'You are Successfully LoggedIn!',success:true});
}); 

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err=new Error("You are not logged in");
    err.status=403;
    next(err);
  }
});
module.exports = router;
