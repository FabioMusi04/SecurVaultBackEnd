import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSWD}@mycluster.kvsrvry.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=MyCluster`;

export async function connectToDatabase() {
    await mongoose.connect(uri);
    console.log('Connected to the database');
};
