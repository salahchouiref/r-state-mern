import express from "express";
import {createListing , deleteListing , updateListing , getListing , getListings}  from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import {listingValidationRules,validateListing} from "../validations/listingValidation.js";

const Router = express.Router();

Router.post("/create",listingValidationRules("create"),validateListing,verifyToken,createListing);
Router.delete("/delete/:id",verifyToken,deleteListing);
Router.post("/update/:id",listingValidationRules(),validateListing,verifyToken,updateListing);
Router.get("/get/:id",getListing);
Router.get("/get",getListings)

export default Router;