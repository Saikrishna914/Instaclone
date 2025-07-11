import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from "./routes/user.route.js";

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


// yaha parb apni api ayegi

app.use('/api/v1/user',userRoute);

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

