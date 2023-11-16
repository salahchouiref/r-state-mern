import express from "express";
import { test , update } from "../controllers/user.controller.js";
import {userUpdateValidationRules,validateUpdate} from "../validations/updateValidation.js"
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test",test);
router.post("/update/:id",verifyToken,userUpdateValidationRules(),validateUpdate,update);

export default router;