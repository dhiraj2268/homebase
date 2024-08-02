const express = require("express");
const app = express();
const mongoose = require("mongoose");
const property = require("./models/property.js");
const path = require("path");

//---------DB connection--------
const MONGO_URL = "mongodb://127.0.0.1:27017/homebase";

main().then(() => {
    console.log("connected to database");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
//----------------end---------------

app.get("/", (req, res) => {
    res.send("hy i am mini project");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.get("/properties", async (req, res) => {
    const allPropertis = await property.find({});
    res.render("properties/index.ejs", { allPropertis });
});

app.listen(3003, () => {
    console.log("server is started on port 3003");
});
