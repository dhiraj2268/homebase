const express=require("express");
const router=express.Router({mergeParams:true});
const {isLoggedIn}=require("../middleware.js");
const wrapeAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {contactSchema}=require("../schema.js");
const Contact = require("../models/contactUs.js");


router.get("/contact", (req, res) => {
    console.log("contact route hits");
    res.render("properties/contactus.ejs");
});
  
  router.post("/properties/contact",isLoggedIn, wrapeAsync(async (req, res) => {
    const contactData = new Contact(req.body.Contact); 
    await contactData.save(); 
    req.flash("success", "We have received your message and will contact you soon .");
    res.redirect("/contact");
}));

  module.exports=router;