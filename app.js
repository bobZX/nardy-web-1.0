var express = require('express');
var ejs = require('ejs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Utils = require('./server/common/utils');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'front/admin/views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'front'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'front/dist')));
app.use('/uploads',express.static(path.join(__dirname, 'server/uploads')));

app.get('/', function(req,res,next){
    res.render('./client/index');
});

app.get('/sign', function(req,res,next){
    res.render('./client/sign');
});

app.get('/main', function(req,res,next){
    res.render('./client/main');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
