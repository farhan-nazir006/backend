import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"



export const verifyJwt = async (req , res , next) => {
  try {

    let token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer " , "")

    if (!token) {
      throw new apiError(401 , "Unauthorized Access")
    }

    let decodedToken  = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken) {
      throw new apiError(401 , "Invalid Access Token")
    }

    let user  = await User.findById(decodedToken._id) ; 

    req.user = user ; 

    next();
     
  } catch (error) {
    throw new apiError(400 , "Invalid Access Token")
  }

}