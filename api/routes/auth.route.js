import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';
import { userValidationRules, validate } from '../validations/authValidation.js';
import { signInValidationRules, validateSignIn } from '../validations/authValidationSignIn.js';

const router = express.Router();

router.post('/signup', userValidationRules(), validate, signup);
router.post('/signin', signInValidationRules(), validateSignIn, signin);

export default router;
