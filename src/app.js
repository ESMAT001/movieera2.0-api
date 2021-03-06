require('dotenv')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
//routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/API');
//middlewares
const apiAuth = require('./middlewares/API/api_auth')

require('./db')

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiAuth, apiRouter);

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
