import { body, validationResult } from 'express-validator';
import { errorHandler } from '../utils/errorHandler.js';

export const userUpdateValidationRules = () => {
  return [
    body('username').trim().isLength({ min: 1 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 5 }).escape(),
    body('profilePicture').optional().isURL().withMessage('Invalid photo URL'),
  ];
};

export const validateUpdate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => error.msg);
    const error = errorHandler(400, 'Validation failed', validationErrors);
    return next(error);
  }

  next();
};
