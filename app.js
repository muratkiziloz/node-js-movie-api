const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const movie = require('./routes/movie');
const director = require('./routes/director');
const user = require('./routes/user');

const app = express();

//db connection

const db = require('./helper/db')();

// config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key);

// Middleware
const cors = require('cors');
app.use(cors());
const verifyToken = require('./middleware/verify-token');

app.all('*', function(req, res,next) {
  /**
   * Response settings
   * @type {Object}
   */
  var responseSettings = {
    "AccessControlAllowOrigin": req.headers.origin,
    "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
    "AccessControlAllowCredentials": true
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }


});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken);
app.use('/api/movies', movie);
app.use('/api/directors', director);
app.use('/api/users', user);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error:{ message: err.message, code: err.code } });
});


module.exports = app;
