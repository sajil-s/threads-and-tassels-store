
import { rateLimit } from "express-rate-limit";

// Common response when a request limit is exceeded.
const limitResponse = {
  success: false,
  message: "Too many requests. Please try again later.",
};

// Forgot Password: 3 requests per 15 minutes.
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: limitResponse,
});

// Reset Password: 5 attempts per 15 minutes.
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: limitResponse,
});

// Login: 10 failed attempts per 15 minutes.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: limitResponse,
});
