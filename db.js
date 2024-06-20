import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const ConnectToDb = async()=>{
    const URL = process.env.MONGODB_URL;
    try {
        await mongoose.connect(URL);
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Error while connecting to the database",error);
    }
}

export default ConnectToDb;