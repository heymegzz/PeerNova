/**
 * Custom Error Classes
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Handle Prisma errors
  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'A record with this value already exists';
    errors = ['Duplicate entry'];
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    if (err.errors) {
      errors = Object.values(err.errors).map(e => e.message || e);
    }
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
      errors = ['File size exceeds maximum allowed size'];
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
      errors = ['Maximum file count exceeded'];
    } else {
      message = 'File upload error';
      errors = [err.message];
    }
  }

  // Handle express-validator errors
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.array().map(e => `${e.param}: ${e.msg}`);
  }

  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    statusCode,
    path: req.path,
    method: req.method,
  });
  
  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Full error object:', err);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors: errors.length > 0 ? errors : undefined,
  });
};

module.exports = {
  errorHandler,
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
};

