    const express=require("express");
    const router=express.Router();
    const wrapeAsync= require("../utils/wrapAsync.js");
    const ExpressError= require("../utils/ExpressError.js");
    const {propertySchema}=require("../schema.js");
    const Property = require("../models/property.js");
    const {isLoggedIn}=require("../middleware.js");



    const validateProperty=(req,res,next)=>{
        let{error}=propertySchema.validate(req.body);
        if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
        }else{
        next();
        }
    }


    //all routes start here-----

    // Index route for property listing
    router.get("/propertyList", wrapeAsync( async (req, res) => {
        const allListing = await Property.find({});
        res.render("properties/propertyList.ejs", { allListing });
    }));
    
    // New property form route
    router.get("/propertyList/new", isLoggedIn,(req, res) => {
        res.render("properties/add_new.ejs");
    });
    
    // Show route 
    router.get("/:id", isLoggedIn,wrapeAsync(async (req, res) => {
        const { id } = req.params;
        const showProperty = await Property.findById(id).populate("reviews").populate("owner");
        if (!showProperty) {
            return res.status(404).send("Property not found");
        }
        res.render('properties/view_property', { showProperty });
    }));
    
    
    // Create property route
    router.post("/propertyList", isLoggedIn,validateProperty,wrapeAsync (async (req, res) => {
        if(!req.body.property){
        throw new ExpressError(400,"send valid data for listing your property");
        }
        const newProperty = new Property(req.body.property);
        await newProperty.save();
        req.flash("success","New Property has  been added successfully!");
        res.redirect("/properties/propertyList");
    }));
    
    // Render edit form route
    router.get("/:id/edit", isLoggedIn,wrapeAsync (async (req, res) => {
        let { id } = req.params;
        const showProperty = await Property.findById(id);
        res.render("properties/edit.ejs", { showProperty });
    }));
    
    // Update route
    router.put("/:id", isLoggedIn,validateProperty,wrapeAsync(async (req, res) => {
        let { id } = req.params;
        await Property.findByIdAndUpdate(id, { ...req.body.property });
        // req.flash("success","changes has been added");
        res.redirect(`/properties/${id}`);
    }));
    
    // Delete route
    router.delete("/:id", isLoggedIn,wrapeAsync(async (req, res) => {
        let { id } = req.params;
        await Property.findByIdAndDelete(id);
        req.flash("success","your property has been deleted successfully!");
        res.redirect("/properties/propertyList");
    }));

    //--------end -----------

    module.exports=router;