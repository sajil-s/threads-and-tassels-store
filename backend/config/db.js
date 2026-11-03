import mongoose from "mongoose";

const connectDb=async ()=>{
    try{
        const connection=await mongoose.connect(process.env.MONGODB_URi);
        console.log(`MongoDB connected : ${connection.connection.host}`);
    }catch(error){
        console.error("mongodb connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDb;