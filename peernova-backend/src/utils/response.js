/**
 * Standard response formatter
 */
const sendResponse = (res, statusCode, data = null, message = '', errors = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    data,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Success response
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return sendResponse(res, statusCode, data, message);
};

/**
 * Error response
 */
const error = (res, message = 'Error', statusCode = 400, errors = null) => {
  return sendResponse(res, statusCode, null, message, errors);
};

module.exports = {
  sendResponse,
  success,
  error,
};

