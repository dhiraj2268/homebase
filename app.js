const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Contact = require("./models/contactUs.js");
const Property = require("./models/property.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapeAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {propertySchema}=require("./schema.js");
const Review=require("./models/reviews.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const JWT_SECRET = "dhirajrohit";

//---------DB connection--------
const MONGO_URL = "mongodb://127.0.0.1:27017/homebase";

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//----------------end---------------

// Serve static files (put this above all routes)
app.use(express.static(path.join(__dirname, "/public"))); 

// Middleware to make the user object available in all views
// app.use((req, res, next) => {
//   res.locals.user = req.user || null;
//   next();
// });

// // Authentication Middleware
// function authenticateToken(req, res, next) {
//   const token = req.cookies.token;
//   if (!token) return next(); 

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.redirect("/login");
//     req.user = user; 
//     next();
//   });
// }

// Setup view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser());

//
app.get("/",(req,res)=>{
  res.send("hi i am mini project");
});

const validateProperty=(req,res,next)=>{
    let{error}=propertySchema.validate(req.body);
    if(error){
      let errMsg= error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
}

// Home route
app.get("/properties", (req, res) => {
  res.render("properties/index.ejs");
});

// Index route for property listing
app.get("/propertyList", wrapeAsync( async (req, res) => {
  const allListing = await Property.find({});
  res.render("properties/propertyList.ejs", { allListing });
}));

// New property form route
app.get("/propertyList/new", (req, res) => {
  res.render("properties/add_new.ejs");
});

// Show route 
app.get('/properties/:id', wrapeAsync(async (req, res) => {
    const { id } = req.params;
    const showProperty = await Property.findById(id);
    if (!showProperty) {
      return res.status(404).send("Property not found");
    }
    res.render('properties/view_property', { showProperty });
}));


// Create route
app.post("/propertyList", validateProperty,wrapeAsync (async (req, res) => {
  if(!req.body.property){
    throw new ExpressError(400,"send valid data for listing your property");
  }
  const newProperty = new Property(req.body.property);
  await newProperty.save();
  res.redirect("/propertyList");
}));

// Render edit form route
app.get("/properties/:id/edit", wrapeAsync (async (req, res) => {
  let { id } = req.params;
  const showProperty = await Property.findById(id);
  res.render("properties/edit.ejs", { showProperty });
}));

// Update route
app.put("/properties/:id", validateProperty,wrapeAsync(async (req, res) => {
  let { id } = req.params;
  await Property.findByIdAndUpdate(id, { ...req.body.property });
  res.redirect(`/properties/${id}`);
}));

// Delete route
app.delete("/properties/:id", wrapeAsync(async (req, res) => {
  let { id } = req.params;
  await Property.findByIdAndDelete(id);
  res.redirect("/propertyList");
}));

//review post route
app.post("/properties/:id/reviews" , async(req,res)=>{

  let showreview= await Property.findById(req.params.id);
  let newReview= new Review(req.body.review);
  showreview.reviews.push(newReview);
  await newReview.save();
  await showreview.save();
  console.log("new review is saved");
  res.send("review saved");

});

//--------end here-------//



// Signup user
app.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

app.post("/signup", async (req, res) => {
  const { username, email, password, phone, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, phone, role });
  await newUser.save();
  res.redirect("/propertyList");
});

// User login routes
app.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/propertyList");
    } else {
      res.redirect("/login");
    }
    
  } catch (error) {
    return res.render("signin" , {
      error : "Incorrect Email or Password" ,
    });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/properties");
});

// Contact us form
app.get('/contact', (req, res) => {
  res.render("properties/contactus.ejs", { user: req.user });
});
app.post("/contact", async (req, res) => {
  try {
      const contactData = new Contact(req.body); 
      await contactData.save(); 
      console.log(contactData);
      res.redirect("properties/contactus.ejs"); 
  } catch (error) {
      console.error("Error while saving contact form data:", error);
      res.status(500).send("There was an error submitting your message.");
  }
});

//---------------
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
});
//-----------

//error handling
app.use((err,req,res,next)=>{
  let {statusCode=500,message="somthing wend wrong"}=err;
  res.status(statusCode).render("error.ejs",{ message });
});
//-------------

// Start server
app.listen(3003, () => {
  console.log("server is started on port 3003");
});
