import express from "express";
import {createListing , deleteListing , updateListing , getListing}  from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import {listingValidationRules,validateListing} from "../validations/listingValidation.js";

const Router = express.Router();

Router.post("/create",listingValidationRules("create"),validateListing,verifyToken,createListing);
Router.delete("/delete/:id",verifyToken,deleteListing);
Router.post("/update/:id",listingValidationRules(),validateListing,verifyToken,updateListing);
Router.get("/get/:id",getListing);

export default Router;