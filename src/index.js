import dotenv from "dotenv"

import connectDb from "./db/index.js";

dotenv.config({
    path: './.env'
})

console.log("🔹 Starting DB connection...");

connectDb();

console.log("🔹 connectDb() called");



