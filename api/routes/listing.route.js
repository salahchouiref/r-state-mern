import express from "express";
import {createListing}  from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const Router = express.Router();

Router.post("/create",verifyToken,createListing);

export default Router;