const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const propertySchema=new Schema({
    title:String,
    description:String,
    image:String,
    price:Number,
    location:String,
    country:String,
});

const property=mongoose.model("property",propertySchema);
module.exports=property;