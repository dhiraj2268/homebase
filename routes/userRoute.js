const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup", async(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username,email,password,phone,role}=req.body;
        const newUser= new User({username,email,phone,role});
        const registterUser=await User.register(newUser,password);
        console.log(registterUser.username);
        req.login(registterUser,(err)=>{
            if(err){
                return next();
            }
            req.flash("success","welcome to homebase");
            res.redirect("/properties");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    

});

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login" ,saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),async(req,res)=>{
        let redirectUrl=res.locals.redirectUrl || "/properties";
        res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next();
        }
    });
    req.flash("success","logout successfull");
    res.redirect("/properties");
})

module.exports=router;