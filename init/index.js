const mongoose=require("mongoose");
const initData=require("./data.js");
const property=require("../models/property.js");

//---------DB connection--------
const MONGO_URL="mongodb://127.0.0.1:27017/homebase";

main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
//----------------end---------------

const initDB=async ()=>{
   await property.deleteMany({});
   await property.insertMany(initData.data);
   console.log("data saved");

}
initDB();