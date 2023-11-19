import express from 'express';
import { google, signin, signout, signup } from '../controllers/auth.controller.js';
import { userValidationRules, validate } from '../validations/authValidation.js';
import { signInValidationRules, validateSignIn } from '../validations/authValidationSignIn.js';
import { googleValidationRules, validateGoogle } from '../validations/authValidationGoogle.js';

const router = express.Router();

router.post('/signup', userValidationRules(), validate, signup);
router.post('/signin', signInValidationRules(), validateSignIn, signin);
router.post('/google', googleValidationRules(), validateGoogle, google);
router.get('/signout', signout);

export default router;
