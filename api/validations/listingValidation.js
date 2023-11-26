import { body, validationResult } from 'express-validator';
import { errorHandler } from '../utils/errorHandler.js';

export const listingValidationRules = (type) => {
  if(type === "create"){
  return [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Name is required'),
    body('description').trim().isLength({ min: 1 }).escape().withMessage('Description is required'),
    body('address').trim().isLength({ min: 1 }).escape().withMessage('Address is required'),
    body('regularPrice').isNumeric().withMessage('Regular Price must be a number'),
    body('discountPrice').isNumeric().withMessage('Discount Price must be a number'),
    body('bathrooms').isNumeric().withMessage('Bathrooms must be a number'),
    body('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
    body('furnished').isBoolean().withMessage('Furnished must be a boolean'),
    body('parking').isBoolean().withMessage('Parking must be a boolean'),
    body('type').trim().isLength({ min: 1 }).escape().withMessage('Type is required'),
    body('offer').isBoolean().withMessage('Offer must be a boolean'),
    body('imageUrls').isArray().withMessage('Image URLs must be an array'),
    body('userRef').trim().isLength({ min: 1 }).escape().withMessage('User Reference is required'),
  ];
  }
  return [
    body('name').optional().trim().isLength({ min: 1 }).escape().withMessage('Name is required'),
    body('description').optional().trim().isLength({ min: 1 }).escape().withMessage('Description is required'),
    body('address').optional().trim().isLength({ min: 1 }).escape().withMessage('Address is required'),
    body('regularPrice').optional().isNumeric().withMessage('Regular Price must be a number'),
    body('discountPrice').optional().isNumeric().withMessage('Discount Price must be a number'),
    body('bathrooms').optional().isNumeric().withMessage('Bathrooms must be a number'),
    body('bedrooms').optional().isNumeric().withMessage('Bedrooms must be a number'),
    body('furnished').optional().isBoolean().withMessage('Furnished must be a boolean'),
    body('parking').optional().isBoolean().withMessage('Parking must be a boolean'),
    body('type').optional().trim().isLength({ min: 1 }).escape().withMessage('Type is required'),
    body('offer').optional().isBoolean().withMessage('Offer must be a boolean'),
    body('imageUrls').optional().isArray().withMessage('Image URLs must be an array'),
    body('userRef').optional().trim().isLength({ min: 1 }).escape().withMessage('User Reference is required'),
  ];
};

export const validateListing = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => error.msg);
    const error = errorHandler(400, 'Validation failed');
    return next(error);
  }

  next();
};