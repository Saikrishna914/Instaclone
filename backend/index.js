import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js"
import {app , server} from './socket/socket.js';
import path from 'path';

const PORT = process.env.PORT || 8000;

// const __dirname = path.resolve();

dotenv.config({});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use(cors ({
    origin:process.env.FRONTEND_URI,
    credentials:true
}))


// yaha par apni api ayegi

app.use('/api/v1/user',userRoute);

app.use('/api/v1/post',postRoute);

app.use('/api/v1/message',messageRoute);

// app.use(express.static(path.join(__dirname,"/frontend/dist")));

// app.get('*',(req,res)=>{
//     res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
// })

app.get('/',(req,res)=>{
    return res.status(200).json({
        message:"Backend ping",
        success:true
    })
})


server.listen(PORT,()=>{
    connectDB();
    console.log(`Server started listening at PORT ${PORT}`);
})

