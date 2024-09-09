const express=require("express");
const router=express.Router({mergeParams:true});
const wrapeAsync= require("../utils/wrapAsync.js");
const Property = require("../models/property.js");
const ExpressError= require("../utils/ExpressError.js");
const Review=require("../models/reviews.js");
const {validateReview, isLoggedIn}=require("../middleware.js");


//review post route
router.post("/" , isLoggedIn,validateReview,wrapeAsync(async(req,res)=>{

  let showreview= await Property.findById(req.params.id);
  let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
  showreview.reviews.push(newReview);
  await newReview.save();
  await showreview.save();
  console.log("new review is saved");
  res.redirect(`/properties/${req.params.id}`);

}));

//delete review route

router.delete("/:reviewId", wrapeAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Property.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/properties/${id}`);
}));

//end here-----

//--------end here-------//

module.exports=router;