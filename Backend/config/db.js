// const mongoose = require("mongoose");

// const connectDB = async () => {
//  await mongoose.connect(process.env.MONGO_URI);
//  console.log("MongoDB Connected");
// };

// module.exports = connectDB;


import mongoose from "mongoose";
import{DB_Name} from"../constants.js";

const connectDB =async () =>{
    try{
     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${ DB_Name }`)//connection hone ke baad mongoose jo response deta hai object ke form me//
     console.log(`\n MONGODB CONNECTED  Successfully yaa huu !! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch(error)
    {
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
  }
   
export  default connectDB