import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    await userValidationRules().forEach((rule) => rule(req, res, next));
    await validate(req, res, next);
  } catch (validationErrors) {
    // Handle validation errors
    return next(errorHandler(400, 'Validation failed'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    // Handle database-related errors
    next(errorHandler(550, 'Error saving user to the database'));
  }
};
  