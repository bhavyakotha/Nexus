import mongoose from "mongoose";

if(process.env.MONGODB_URI){
    throw new Error(
        "Please provide URI in .env file, Bello!"
    )
}

async function connectDB(params) {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Kumbaya, MongoDB connected")
    } catch (error) {
        console.log("MongoDB error", error)
        process.exit(1)
    }
}

export default connectDB