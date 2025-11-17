import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/helpers.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    errorResponse(res, 'Authentication failed', 401, error);
  }
};
