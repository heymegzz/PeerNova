import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};
