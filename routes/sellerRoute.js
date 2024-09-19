const express = require("express");
const router = express.Router();
const Seller = require("../models/seller.js");
const wrapeAsync = require("../utils/wrapAsync.js");
const Property = require("../models/property.js");
const {isLoggedIn,ispropertyOwner}=require("../middleware.js");

router.get("/", isLoggedIn, ispropertyOwner, wrapeAsync(async (req, res) => {
    const properties = await Property.find({ propertyOwner: req.user._id });
    res.render("properties/sellerDashboard.ejs", { properties });
  }));

module.exports = router;  // <-- Make sure the router is exported properly
