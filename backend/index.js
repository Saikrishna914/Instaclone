import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

const PORT = process.env.PORT || 8000;

dotenv.config({});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

app.use(cors ({
    origin:'http://localhost:5173',
    credentials:true
}))

app.get('/',(req,res)=>{
    return res.status(200).json({
        message:"Backend ping",
        success:true
    })
})


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server started listening at PORT ${PORT}`);
})

