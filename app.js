const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Contact = require("./models/contactUs.js");
const property = require("./models/property.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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

// Middleware to make the user object available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next(); // Proceed without setting user if no token is present

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user; // Set the user object in the request
    next();
  });
}

// Setup view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser());

// Home route
app.get("/properties", (req, res) => {
  res.render("properties/index.ejs");
});

// Index route for property listing
app.get("/propertyList", authenticateToken, async (req, res) => {
  const allListing = await property.find({});
  res.render("properties/propertyList.ejs", { allListing });
});

// New property form route
app.get("/propertyList/new", authenticateToken, (req, res) => {
  res.render("properties/add_new.ejs");
});

// Show route
app.get("/properties/:id", async (req, res) => {
  let { id } = req.params;
  const showProperty = await property.findById(id);
  res.render("properties/view_property.ejs", { showProperty });
});

// Create route
app.post("/propertyList", authenticateToken, async (req, res) => {
  const newProperty = new property(req.body.property);
  await newProperty.save();
  res.redirect("/propertyList");
});

// Render edit form route
app.get("/properties/:id/edit", authenticateToken, async (req, res) => {
  let { id } = req.params;
  const showProperty = await property.findById(id);
  res.render("properties/edit.ejs", { showProperty });
});

// Update route
app.put("/properties/:id", authenticateToken, async (req, res) => {
  let { id } = req.params;
  await property.findByIdAndUpdate(id, { ...req.body.property });
  res.redirect(`/properties/${id}`);
});

// Delete route
app.delete("/properties/:id", authenticateToken, async (req, res) => {
  let { id } = req.params;
  await property.findByIdAndDelete(id);
  res.redirect("/propertyList");
});


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
})

  }

});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/properties");
});

//contact us form
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
//--------------
// Start server
app.listen(3003, () => {
  console.log("server is started on port 3003");
});
