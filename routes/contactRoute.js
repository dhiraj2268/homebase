const express=require("express");
const router=express.Router({mergeParams:true});
const wrapeAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {contactSchema}=require("../schema.js");
const Contact = require("../models/contactUs.js");




// const validateContact=(req,res,next)=>{
//     let{error}=contactSchema.validate(req.body);
//     if(error){
//     let errMsg= error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400, errMsg);
//     }else{
//     next();
//     }
// }


router.get("/contact", (req, res) => {
    console.log("contact route hits");
    res.render("properties/contactus.ejs");
});
  
  router.post("/contact", wrapeAsync(async (req, res) => {
    const contactData = new Contact(req.body.Contact); 
    await contactData.save(); 
    req.flash("success", "We have received your message and will get back to you soon.");
    res.redirect("/properties/contact");
}));

  module.exports=router;