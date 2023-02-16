const { ValidationError } = require('sequelize')
const boom = require('@hapi/boom');

function logErrors (err, req, res, next) {
  console.error(err);
  next(err);
}

function errorSqlHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    next(boom.conflict(err.errors[0].message));
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}


module.exports = { logErrors, errorHandler, errorSqlHandler, boomErrorHandler }
