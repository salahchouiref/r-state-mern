import { body, validationResult } from 'express-validator';
import { errorHandler } from '../utils/errorHandler.js';

// Validation rules for signIn
export const signInValidationRules = () => {
  return [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }).escape(),
  ];
};

// Middleware to validate the signIn data
export const validateSignIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => error.msg);
    const error = errorHandler(400, 'Validation failed', validationErrors);
    return next(error);
  }

  next();
};
