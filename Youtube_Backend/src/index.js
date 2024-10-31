//require("dotenv").config({ path : '/.env'}) common js
import dotenv from "dotenv" // modular js
import connectDB from "./db/index.js";


// in modular js we have to config detenv file separately
dotenv.config( {
    path : "./env"
})

connectDB()













/* It is an IIFE
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
    } catch (error) {
        console.error("ERROR:", error);
        throw error
    }
})()




*/