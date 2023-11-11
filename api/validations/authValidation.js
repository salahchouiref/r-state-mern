// validation/userValidation.js

import { body, validationResult } from 'express-validator';
import { errorHandler } from '../utils/errorHandler.js';

export const userValidationRules = () => {
  return [
    body('username').trim().isLength({ min: 1 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }).escape(),
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => error.msg);
    const error = errorHandler(400, 'Validation failed');
    return next(error);
  }

  next();
};

