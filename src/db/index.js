import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {

  try {
    console.log("Start connecting mongo");
    

    const connectionInstance = await mongoose.connect(`mongodb://localhost:27017/videotube`)

    console.log("MongoDb Connected successfuly !! " , connectionInstance.connection.host);
    
  } catch (error) {
    console.log("Mongodb Connection Failed " , error);
    process.exit(1);
  }
}

export default connectDb;