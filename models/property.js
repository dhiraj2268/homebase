const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const propertySchema=new Schema({
    title: {
        type: String,
        required: true,
      },
      price: Number,
      description: String,
      location: String,
      country:String,
      bedrooms:Number,
      bathrooms:Number,
      squarefeet:Number,
      image: {
        url: String,
        filename:String,
      },
      sellername:String,
      sellercontact:String,
      reviews:[
        {
          type: Schema.Types.ObjectId,
          ref:"Review",
        },
      ],
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    propertyOwner: {
      type: Schema.Types.ObjectId,
      ref: "propertyOwner", // Reference to the owner
      required: true,
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
});

propertySchema.post("findOneAndDelete", async(property)=>{
  if(property){
    await Review.deleteMany({_id : {$in : property.reviews}});
  }
});

const property=mongoose.model("property",propertySchema);
module.exports=property;