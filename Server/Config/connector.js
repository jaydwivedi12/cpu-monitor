import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function connectDB(){
    try {
        const con=await mongoose.connect(process.env.MONGODB_URL,{
        })
        console.log(
            `Connected to MongoDB ${con.connection.host}`
          );
    } catch (error) {
        console.error
            (`Error in db connection ${error}`);
    }
}

export default connectDB;