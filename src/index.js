// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js"

//require('dotenv').config()


import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';


dotenv.config(
    {
        path:'./env'
    }
)
app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}))
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({limit:'16kb'}));
app.use(express.static('public'));
app.use(cookieParser());



connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`the app is running on port : ${process.env.PORT}`)
    })
    app.on('error',()=>{
        console.log(`the app is running on port : ${error}`)
    })
})
.catch((error)=>{
    console.log(`database connection failed and error is :${error}`)
})

// const app= express()

// (async()=>{
//     try{
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error',()=>{
//             console.log("not able to listen to mongodb",error)
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`the app is listening on port: ${process.env.PORT}`)
//         })
//     }
//     catch(error){
//         console.error("Connection failed",error)
//         throw error;
//     }

// })()