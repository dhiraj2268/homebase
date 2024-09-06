const mongoose=require("mongoose");
const Schema=mongoose.Schema;


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
        type:String,
        default:
          "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set:(v)=>
          v===""
           ?"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
           :v,
      },
      sellername:String,
      sellercontact:String,
      reviews:[
        {
          type: Schema.Types.ObjectId,
          ref:"Review",
        },
      ],
});

const property=mongoose.model("property",propertySchema);
module.exports=property;