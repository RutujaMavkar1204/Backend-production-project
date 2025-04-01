// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js"

//require('dotenv').config()

import {app} from './app.js'
import dotenv from 'dotenv';
import connectDB from './db/index.js';
 


dotenv.config(
    {
        path:'./.env'
    }
)


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

import userRouter from './routes/user.router.js'

app.use('/api/v1/users', userRouter)


















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