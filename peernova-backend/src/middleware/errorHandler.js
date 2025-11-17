import { errorResponse } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.message.includes('Unique constraint failed')) {
    return errorResponse(res, 'Email already exists', 409);
  }

  errorResponse(res, 'Internal server error', 500, err);
};
