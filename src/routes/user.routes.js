import { Router } from "express";
import { loginUser, registerUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.post("/register" , upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]) ,registerUser)

router.post("/login" , loginUser); 

export default router;
