import { Router } from "express";
import { loginUser, logoutUser, registerUser , generateNewAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

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

//secured routes (when the user is login)
router.post("/logout" , verifyJwt ,  logoutUser)
router.post("/Access-Token" , generateNewAccessToken);

export default router;
