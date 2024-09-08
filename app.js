const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");


const propertyRouter=require("./routes/propertyRoute.js");
const reviewRouter=require("./routes/reviewRoute.js");
const userRouter= require("./routes/userRoute.js");
const contactRouter=require("./routes/contactRoute.js");





const sessionOption={
  secret:"miniproject",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 2 * 24 * 60 * 60 * 1000,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  }
};

// app.use(session(sessionOption));
// app.use(flash());


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

// Setup view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser());

app.get("/",(req,res)=>{
  res.send("hi i am mini project");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});


app.use("/properties",propertyRouter);
app.use("/properties/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/",contactRouter);
// app.use("/properties/contact",contactInfo);
// Home route
app.get("/properties", (req, res) => {
  res.render("properties/index.ejs");
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
