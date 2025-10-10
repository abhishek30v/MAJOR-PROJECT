const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require("mongoose");
const initData = require("D:/WanderLust/init/data.js");
const Listing = require("D:/WanderLust/models/listing.js");
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGO_URL;

main()
.then((res) =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}


//initializing the database by inserting data from data.js
const initDB = async() =>{
   await Listing.deleteMany({});  //delete existing data if any
   initData.data = initData.data.map((obj) => ({...obj, owner: "68e4451b92a401fba36f9478" }));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();