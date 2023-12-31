import express from "express";
import { test , update , deleteUser , getUserListings , getUser } from "../controllers/user.controller.js";
import {userUpdateValidationRules,validateUpdate} from "../validations/updateValidation.js"
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test",test);
router.post("/update/:id",verifyToken,userUpdateValidationRules(),validateUpdate,update);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get("/listings/:id",verifyToken,getUserListings);
router.get("/:id",verifyToken,getUser);

export default router;