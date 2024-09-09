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
});

propertySchema.post("findOneAndDelete", async(showProperty)=>{
  if(showProperty){
    await Review.deleteMany({_id : {$in : showProperty.reviews}});
  }
});

const property=mongoose.model("property",propertySchema);
module.exports=property;