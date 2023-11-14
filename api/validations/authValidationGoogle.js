import { body, validationResult } from 'express-validator';
import { errorHandler } from '../utils/errorHandler.js';

// Validation rules for Google authentication
export const googleValidationRules = () => {
  return [
    body('name').trim().isLength({ min: 1 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('photo').isURL().withMessage('Invalid photo URL'),
  ];
};

// Middleware to validate the Google authentication data
export const validateGoogle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => error.msg);
    const error = errorHandler(400, 'Validation failed');
    return next(error);
  }

  next();
};
