import express from 'express';
import { signup } from '../controllers/auth.controller.js';
import { userValidationRules, validate } from '../validations/authValidation.js';

const router = express.Router();

router.post('/signup', userValidationRules(), validate, signup);

export default router;
