export const successResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 400, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || null,
  });
};
