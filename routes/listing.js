const express = require("express");
const router = express.Router();

const {listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(error);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

  })
);

//create route
router.post(
  "/",
  //
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let listing=req.body.listing;
    // console.log(listing);
    // try{
    //   const newListing=new Listing(req.body.listing);
    // await newListing.save();
    // res.redirect("/listings");
    // }
    // catch(err){
    //   next(err);
    // }
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
    //
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //   throw new ExpressError(400,result.error);
    // }
    //
    const newListing = new Listing(req.body.listing);
    //for all model fields impossible so joi
    // if(!newListing.title){
    //   throw new ExpressError(400,"title missing");
    // }
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

//delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports=router;