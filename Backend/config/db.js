import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ mongo Db connection sucessifull");
    } catch (error) {
        console.log("mongo db connection error ",error);
        process.exit(1);

    }
}

export default connectDB;