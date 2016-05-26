var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

mongoose.connect('mongodb://localhost/wedding-penguin');

require ('./models/Guests');
require ('./models/Checklists');
require ('./models/Budget');
require ('./models/Users');
require ('./config/passport');


var routes = require('./routes/index.js');
var guest_routes = require('./routes/guest_routes.js')
var checklist_routes = require('./routes/checklist_routes.js')
var budget_routes = require('./routes/budget_routes.js')
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));  //use to add default directory, e.g. public


app.use('/', routes);
app.use('/guests', guest_routes);
app.use('/checklists', checklist_routes);
app.use('/budget', budget_routes);
app.use(express.static(path.join(__dirname, 'views')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
