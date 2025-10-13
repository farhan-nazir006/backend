import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // from cloudniary
      required: true
    },
    coverImage: {
      type: String, //from cloudinary 
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    refreshToken: {
      type: String
    }

  }
  ,
  { timestamps: true })  // timestamps provides both createdAt and updatedAT

  //Ecryption of password using bcrypt  , password checking
  // access nd refresh token genearator

  userSchema.pre("save" ,async function(next){
    if (!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password , 10);
    next()
  })

  userSchema.methods.isPasswordCorrect(async function (password) {
   return await bcrypt.compare(password , this.password)
  })

  userSchema.methods.accesTokenGenerator(function(){
       return jwt.sign(
          {
            _id : this._id,
            email: this.email,
            fullName : this.fullName
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
          }
        )
  })

  userSchema.methods.refreshTokenGenerator(function(){
       return jwt.sign(
          {
            _id : this._id,
            email: this.email,
            fullName : this.fullName
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
          }
        )
  })


  



export const User = mongoose.model("User", userSchema)

