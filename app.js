var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var FileStore=require('session-file-store')(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var PromoRouter = require('./routes/promoRouter');
var LeaderRouter = require('./routes/leaderRouter');
var authenticate=require('./authenticate');
var passport=require('passport');
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url); var app = express();

connect.then((db) => {
  console.log("Connected correctly to server");

}, (err) => { console.log(err); });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('1234567890-savan'));
app.use(session({
  name:'session-id',
  secret:'savan-is-great',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
function auth(req,res,next){
  console.log(req.session);
  if(!req.user){
      var err=new Error("You are not authenticated");
      err.status=403;
      return next(err);
  }
  else{
      next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/leaders', LeaderRouter);
app.use('/promotions', PromoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
