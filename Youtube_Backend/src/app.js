import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";


const app = express();


// to configure CORS error
app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
))


app.use(express.json(
    {
        limit : "16kb"
    }
))

app.use(express.urlencoded(
    {
        extended : true ,
        limit : "16kb"
    }
))

// to serve public assets on my server
app.use(express.static("public")) // as we have public folder .


// to access & set cookies of user's brower from my server || basically to perform CRUD operations on cookies
app.use(cookieParser()) // have options but not needed as of now



export { app } 