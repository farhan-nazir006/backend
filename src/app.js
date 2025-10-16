import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.COR_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({limit:"10kb" , extended:true}));
app.use(express.static("Public")) // for static files => images , svgs , favicon
app.use(cookieParser());


//Router Import 
import userRouter from "./routes/user.routes.js";



//Router Declarearion
app.use("/api/v1/users" , userRouter)



export {app};