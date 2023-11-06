import { NextFunction, Request,Response } from "express";


// @desc    Function That Handles Invalid JWT Tokens (UNAUTHORIZED)
const handleJWTError = () => {
    return {message : "Invalid token, Please login again!", code : 401};
}

// @desc    Function That Handles Expired JWT Tokens (UNAUTHORIZED)
const handleJWTExpiredError = () =>{
    return {message : "Your token has expired! Please login again!", code : 401};
}

// @desc    Function That Handles MongoDB Casting Errors (BAD_REQUEST)
const handleCastErrorDB = (err : any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return {message : message, code : 400};
};

// @desc    Function That Handles MongoDB Duplication Errors (BAD_REQUEST)
const handleDuplicateFieldsDB = (err : any) => {
  const dupField = Object.keys(err.keyValue)[0];
  const message = `Duplicate field(${dupField}). Please use another value(${err.keyValue[dupField]})!`;
  return {message : message, code : 400};
};

// @desc    Function That Handles MongoDB Validation Errors (BAD_REQUEST)
const handleValidationErrorDB = (err : any) => {
  const errors = Object.values(err.errors).map((el : any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return {message : message, code : 400};
};

// // @desc    Function That Shows Details About The Error Only on The Development Phase
// const sendErrorDev = async (err, req, res) =>
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: `${err.message}`,
//     stack: err.stack
//   });

// // @desc    Function That Shows Little Info About The Error Only on The Production Phase
// const sendErrorProd = async (err, req, res) => {
//   // A) Operational, trusted error: send message to client
//   if (err.isOperational) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       message: `${err.message}`
//     });
//   }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
//   logger.error('ERROR 💥', err);
//   // 2) Send generic message
//   return res.status(500).json({
//     status: 'error',
//     message: `Something went wrong!`
//   });
// };

export default (error : any) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
  
    // Send Errors in The Development Phase
    // if (config.env === 'development') {
    //   sendErrorDev(err, req, res);
  
      // Send Errors in The Production Phase
    // } else if (config.env === 'production') {
    //   let error = { ...err };
    //   error.message = err.message;
  
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
    //   sendErrorProd(error, req, res);
    
    return error;
}