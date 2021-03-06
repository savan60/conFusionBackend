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
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoritesRouter');

var PromoRouter = require('./routes/promoRouter');
var commrntRouter = require('./routes/commenRouter');

var LeaderRouter = require('./routes/leaderRouter');
var authenticate=require('./authenticate');
var passport=require('passport');
const mongoose = require('mongoose');
const config=require('./config');
const commentRouter = require('./routes/commenRouter');
const url=config.mongoUrl;
const connect = mongoose.connect(url); 

var app = express();
app.all('*',(req,res,next)=>{
  if(req.secure){
    return next();
  }
  else{
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
  }
});
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

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/leaders', LeaderRouter);
app.use('/favorites', favoriteRouter);
app.use('/promotions', PromoRouter);
app.use('/imageUpload', uploadRouter);
app.use('/comments', commentRouter);


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
