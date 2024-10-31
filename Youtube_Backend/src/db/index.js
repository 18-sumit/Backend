import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file



const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR" , error);
        // current jo applicaion chal rahi h wo ek process pe  chal rahi h aur ye process uska refrence h
        process.exit(1) 
    }
}

export default connectDB ;