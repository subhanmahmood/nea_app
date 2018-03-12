//Imports 
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var passport = require('passport')
var session = require('express-session')
var env = require('dotenv').load()
var server = http.createServer(app);
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = express.Router( )

//Import route files
var index = require('./routes/index');
var api = require('./routes/api');

//Import mysql drivers and connection
var mysql = require('mysql');
var connection = require('./database');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
	res.locals.connection = connection;
	res.locals.connect;
	next();
})

app.use('/', index);
app.use('/api/', api);

 // For Passport
 app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 app.use(passport.initialize());
 app.use(passport.session()); // persistent login sessions


//Models
 var models = require("./app/models");


 //Routes 
 var authRoute = require('./app/routes/auth.js')(app,passport);


 //load passport strategies
 require('./app/config/passport/passport.js')(passport,models.user);


//Sync Database
models.sequelize.sync().then(function(){
  console.log('Nice! Database looks fine')
})
.catch(function(err){
  console.log(err,"Something went wrong with the Database Update!")
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // respond with html page
  if (req.accepts('html')) {
    res.render('index', { title: '404 Not Found', source: 'notFound' });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
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
