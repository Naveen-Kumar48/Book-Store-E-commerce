const AppError = require("../utils/AppError");

const handleTokenExpiredError = () => {
  return new AppError(`your token is expires ,Please Login again `, 401);
};

const handleJsonWebTokenError = () => {
  return new AppError(`Invalid Token Please Login again`, 401);
};

const handleCastErrorDB = (err) => {
  // console.log(err);
  const message = `Invalid path ${err.path} : ${err.value} `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(errObj);
  const message = `Invalid Data : ${errors.join(", ")}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const errors = Object.values(err.keyValue).join(". ");
  const message = `Duplicate field values :${errors} please use another value`;

  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  console.error('ERROR 💥', err);
  const fs = require('fs');
  fs.appendFileSync('error.log', `${new Date().toISOString()} - ${err.stack}\n\n`);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: `SomeThing went very wrong`,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  let error = { ...err };
  error.name = err.name;
  error.stack = err.stack;
  error.message = err.message;

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.code === 11000) error = handleDuplicateErrorDB(error);

  if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
  if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

  if (process.env.NODE_ENV === "development") {
    sendDevError(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendProdError(error, res);
  }
};

// 401
