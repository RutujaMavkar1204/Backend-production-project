import express from "express"
const app=express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}))
app.use(express.json({limit:'16kb'})); //parse form submission from json to javascript
app.use(express.urlencoded({limit:'16kb'})); // encode the url
app.use(express.static('public'));//store some files and document in this public folder
app.use(cookieParser());//change cookies of client

export {app}