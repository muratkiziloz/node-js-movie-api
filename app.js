const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const movie = require('./routes/movie');
const director = require('./routes/director');
const user = require('./routes/user');
const cors = require('cors');
const app = express();

//db connection

const db = require('./helper/db')();

// config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key);

// Middleware
const verifyToken = require('./middleware/verify-token');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
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


// const corsOptions = {
//   origin: 'https://node-filmrafi-api.herokuapp.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
//
// // app.get('/products/:id', cors(corsOptions), function (req, res, next) {
// //   res.json({msg: 'This is CORS-enabled for only example.com.'})
// // });
//
// app.get("*", function(req, res) {
//   res.send("sms app server status: RUNNING");
// });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://node-filmrafi-api.herokuapp.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


module.exports = app;
