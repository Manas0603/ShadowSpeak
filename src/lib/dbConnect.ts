import mongoose from "mongoose";
// import { promise } from "zod";

type ConnectionObject= {
    isConnected?:number;
}
console.log("MONGOOSE_URI =", process.env.MONGOOSE_URI);
// Check if the environment variable is set

const connection : ConnectionObject={}

async function dbConnect(): Promise<void> {

    if(connection.isConnected){
        console.log("DB is connected")
        return 
    }
    try{
        const db= await mongoose.connect("mongodb+srv://manassharma850:0KyyKkaOJ4jDEQEC@cluster0.5yrwun2.mongodb.net/")

        connection.isConnected=db.connections[0].readyState

        console.log("db connected succefully")

    }
    catch(error){
        console.log("db connection failed",error);
        process.exit(1)
    }
}

export default dbConnect;