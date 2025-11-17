import bcryptjs from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return errorResponse(res, 'All fields are required', 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    // Return response
    successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user.id);

    // Return response
    successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};
