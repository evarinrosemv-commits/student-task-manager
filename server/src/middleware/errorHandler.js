const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Details]', err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Mongoose Duplicate Key (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `An account with this ${field} already exists. Please use a different ${field} or log in.`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication session expired. Please log in again.',
    });
  }

  // Default fallback internal server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error. Please try again later.',
  });
};

module.exports = errorHandler;
