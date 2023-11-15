import express from "express";
import { test , update } from "../controllers/user.controller.js";
import {userUpdateValidationRules,validateUpdate} from "../validations/updateValidation.js"

const router = express.Router();

router.get("/test",test);
router.post("/update/:id",userUpdateValidationRules(),validateUpdate,update);

export default router;