import Listing from "../models/Listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createListing = async (req,res,next) => {
    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    }catch(err){
        next(err);
    }
};

export const deleteListing = async (req,res,next) => {
    const listing = await Listing.findOne({_id:req.params.id});
    if(!listing) return next(errorHandler(404,"Listing not found!"));
    if(req.user.id !== listing.userRef) return next(errorHandler(404,"You can delete only you're listings!"));
    try{
        await Listing.findOneAndDelete(listing._id);
        res.status(200).json("Listing has been deleted");
    }catch(err){
        next(err);
    }
}