const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const property = require("./models/property.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

//---------DB connection--------
const MONGO_URL = "mongodb://127.0.0.1:27017/homebase";

main().then(() => {
    console.log("connected to database");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
//----------------end---------------


//home route
app.get("/properties", (req, res) => {
    res.render("properties/index.ejs");
});
//---------

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

//index route

app.get("/propertyList", async (req, res) => {
    const allListing = await property.find({});
    res.render("properties/propertyList.ejs", { allListing });
});

//---------------



//new property form route

app.get("/propertyList/new",(req,res)=>{
    res.render("properties/add_new.ejs");
});

//----------------

//show route

app.get("/properties/:id", async(req,res)=>{
    let {id}=req.params;
    const showProperty = await property.findById(id);
    res.render("properties/view_property.ejs",{showProperty});
});


//----------------


//create route

app.post("/propertyList", async(req,res)=>{
    const newProperty= new property(req.body.property);
    await newProperty.save();
    res.redirect("/propertyList");
});

//----------


//render edit form route
app.get("/properties/:id/edit", async (req, res) => {
    let { id } = req.params;
    const showProperty = await property.findById(id);
    res.render("properties/edit.ejs", { showProperty });
});

//update route
app.put("/properties/:id", async (req, res) => {
    let { id } = req.params;
    await property.findByIdAndUpdate(id, { ...req.body.property });
    res.redirect(`/properties/${id}`);
});
//----------------------

//delete route
app.delete("/properties/:id", async(req,res)=>{
    let {id}=req.params;
    let deleteProperty= await property.findByIdAndDelete(id);
    console.log(deleteProperty);
    res.redirect("/propertyList");
    
});

//------------


//user route
app.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


//-----------------------

//signup user
app.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

//------------

app.listen(3003, () => {
    console.log("server is started on port 3003");
});
