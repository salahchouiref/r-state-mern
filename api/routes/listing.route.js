import express from "express";
import {createListing , deleteListing}  from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const Router = express.Router();

Router.post("/create",verifyToken,createListing);
Router.delete("/delete/:id",verifyToken,deleteListing);

export default Router;