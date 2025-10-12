import dotenv from "dotenv"

import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})


connectDb()   // calling db connection method
.then( () => {  // if db suucessfulyy connected then
app.listen(process.env.PORT || 5000 , () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    
})
})
.catch((error) => {  // if db not connected then
    console.log("Mongodb connection error " , error);
    throw error
})





