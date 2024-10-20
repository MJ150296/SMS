import mongoose from "mongoose";
import "dotenv/config";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  console.log("URI,", process.env.MONGODB_URI);
  console.log("DBNAME", DB_NAME);
  
  
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log("Mongo DB connected at: ", connectionInstance.connection.host);
  } catch (error) {
    console.error("Connection error while connecting Mongo DB cluster in Index.db.js", error);
  }
};

export default connectDB;
