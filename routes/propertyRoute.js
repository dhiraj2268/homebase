    const express=require("express");
    const router=express.Router();
    const wrapeAsync= require("../utils/wrapAsync.js");
    const ExpressError= require("../utils/ExpressError.js");
    const Property = require("../models/property.js");
    // const propertyOwner=require("../models/seller.js");
    const {isLoggedIn,validateProperty}=require("../middleware.js");
    const multer=require("multer");
    const {storage}=require("../cloudConfig.js");
    const upload=multer({storage});
    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
    const mapToken=process.env.MAP_TOKEN;
    const geocodingClient = mbxGeocoding({ accessToken: mapToken });



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

    //search route

  // Search route based on location
  router.get("/search", async (req, res) => {
    const { location } = req.query;
    if (!location) {
      req.flash("error", "Please enter a valid location.");
      return res.redirect("/properties/propertyList");
    }
  
    // Search for properties that match the location query
    const matchingProperties = await Property.find({
      location: new RegExp(location, "i"), // Case-insensitive match
    });
  
    if (matchingProperties.length === 0) {
      req.flash("error", "No properties found for this location.");
      return res.redirect("/properties/propertyList");
    }
  
    res.render("properties/propertyList.ejs", { allListing: matchingProperties });
  });


    //end----
    
    // Show route 
    router.get("/:id", isLoggedIn,wrapeAsync(async (req, res) => {
        const { id } = req.params;
        const property = await Property.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
        // .populate({path:"reviews", populate:{path:"author",}})
        // .populate("owner"); 
        if (!property) {
            return res.status(404).send("Property not found");
        }
        res.render('properties/view_property', { property });
    }));
    
    
    // Create property route
    router.post("/propertyList", isLoggedIn,upload.array('property[image]', 5),validateProperty,wrapeAsync (async (req, res) => {

        let response= await geocodingClient.forwardGeocode({
            query:req.body.property.location,
            limit:1,
        }).send();

        if(!req.body.property){
        throw new ExpressError(400,"send valid data for listing your property");
        }
        // let url=req.file.path;
        // let filename=req.file.filename;
        const newProperty = new Property(req.body.property);
        newProperty.owner = req.user._id;
        newProperty.propertyOwner=req.user._id;

        newProperty.image = req.files.map(f => ({ url: f.path, filename: f.filename }));

        newProperty.geometry=response.body.features[0].geometry;
        await newProperty.save();
        req.flash("success","New Property has  been added successfully!");
        res.redirect("/properties/propertyList");
    }));
    
    // Render edit form route
    router.get("/:id/edit", isLoggedIn,wrapeAsync (async (req, res) => {
        let { id } = req.params;
        const property = await Property.findById(id);

        let originalImageUrl = property.image && property.image.length > 0 ? property.image[0].url : '';
        if (originalImageUrl) {
            originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
        }
        res.render("properties/edit.ejs", { property ,originalImageUrl});
    }));
    
    // Update route
    router.put("/:id", isLoggedIn,upload.array('property[image]', 5),validateProperty,wrapeAsync(async (req, res) => {
        let { id } = req.params;
       let updateProperty= await Property.findByIdAndUpdate(id, { ...req.body.property });
       if(typeof req.file !=="undefined"){
        // let url=req.file.path;
        // let filename=req.file.filename;
        updateProperty.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        // updateProperty.image={url,filename};
        await updateProperty.save();
       }
        
        
       res.redirect(`/properties/${id}`);
    }));
    
    
    // Delete route
    router.delete("/:id", isLoggedIn,wrapeAsync(async (req, res) => {
        let { id } = req.params;
        await Property.findByIdAndDelete(id);
        req.flash("success","your property has been deleted successfully!");
        res.redirect("/properties/propertyList");
    }));

    router.post("/:id/like", isLoggedIn, wrapeAsync(async (req, res) => {
        const { id } = req.params;  // Property ID
        const userId = req.user._id; // Logged-in user ID
        
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });
      
        // Check if the user has already liked the property
        const hasLiked = property.likes.includes(userId);
      
        if (hasLiked) {
          // Unlike if already liked
          property.likes = property.likes.filter((like) => !like.equals(userId));
        } else {
          // Like if not already liked
          property.likes.push(userId);
        }
      
        await property.save();
        res.json({ success: true, liked: !hasLiked, totalLikes: property.likes.length });
      }));  
    //--------end -----------

    module.exports=router;