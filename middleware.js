const Property = require("./models/property.js");
const {propertySchema,reviewSchema}=require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let property=await Property.findById(id);
    if(!property.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.validateProperty=(req,res,next)=>{
    let{error}=propertySchema.validate(req.body);
    if(error){
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
    }else{
    next();
    }
}



module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg= error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
}
