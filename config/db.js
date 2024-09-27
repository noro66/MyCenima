const mongoose = require("mongoose");

async function  connectToDB(){
    try{
       await mongoose.connect(process.env.MONGO_URL)
        console.log("connected  To Mongodb...")
    }catch (error){
        console.log("connection failed  To MongoDB", error)
    }
}
module.exports = connectToDB;