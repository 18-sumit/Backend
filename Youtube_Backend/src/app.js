import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";


const app = express();

// to configure CORS error
app.use(cors({origin : process.env.CORS_ORIGIN,credentials : true}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true ,limit : "16kb"}))

// to serve public assets on my server
app.use(express.static("public")) // as we have public folder .

// to access & set cookies of user's brower from my server || basically to perform CRUD operations on cookies
app.use(cookieParser()) // have options but not needed as of now
// after using it : options are for security purpose in cookies , from cookieParser



// routes import 

import userRouter from './routes/user.routes.js'

// routes declaration

// use middleware to interact with routes

app.use("/api/v1/users" , userRouter);

//app.use("/api/v1/users/actualroute") hum api bana rahe h isliye
// iska sturcture aisa h ki app.use("/prefix" , routerToBeUsed) 
//aise upar wala middleware chal rha h "/users" route nahi h wo route ka prfeix hai
// fir yaha se user.routes pe jana h aur waha routes likhenge
// it will look like this : http://localhost:8000/api.v1/users/register
// and agar login ke liye karenge fir hame baar baar app.use me changes nahi karne padenge /users ke baad ke sab user.routes me likhenge

export { app } 