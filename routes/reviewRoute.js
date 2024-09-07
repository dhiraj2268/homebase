const express=require("express");
const router=express.Router({mergeParams:true});
const wrapeAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Property = require("../models/property.js");
const Review=require("../models/reviews.js");




const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg= error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
}


//review post route
router.post("/" , validateReview,wrapeAsync(async(req,res)=>{

  let showreview= await Property.findById(req.params.id);
  let newReview= new Review(req.body.review);
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