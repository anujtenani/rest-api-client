var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
const test = require('./routes/test');
const helper = require('./routes/helper');
const proxy = require('./routes/proxy');
const auth = require('./routes/auth');


var app = express();
app.use(cors());

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..','build')));

app.use('/', index);
app.use('/test', test);
app.use('/auth', auth);
app.use('/helper', helper);
app.use('/proxy', proxy);
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
//    res.sendFile(path.join(__dirname, '..','build','index.html'));
//  res.status(err.status || 500);
  res.send(JSON.stringify(err));
});

module.exports = app;
