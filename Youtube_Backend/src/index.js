//require("dotenv").config({ path : '/.env'}) common js
import dotenv from "dotenv" // modular js
import connectDB from "./db/index.js";
import { app } from "./app.js";


// in modular js we have to config detenv file separately
dotenv.config({
    path: "./env"
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERRR: ", error);
            throw error
        }),

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at Port : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED !!", err)
    })













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