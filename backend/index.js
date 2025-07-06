// const express = require('express')// method-1
import express from "express"; // method-2
import dotenv from "dotenv"; 
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./socket/socket.js";
dotenv.config({});
import path from "path";
 
const PORT = process.env.PORT || 5000;
const ur ='https://connect-h2wl.onrender.com/';

const _dirname = path.resolve();
// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());
const corsOption={
    origin:ur,
    credentials:true
};
app.use(cors(corsOption)); 


// routes
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);
 

app.use(express.static(path.join(_dirname,"/frontend/build")));
app.get('*',(_,res)=>{
    res.sendFile(path.resolve(_dirname,"frotend","dist","index.html"));
});

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at prot ${PORT}`);
});

