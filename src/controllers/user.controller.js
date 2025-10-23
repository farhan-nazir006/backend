import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinay.js";
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const options = {
  httpOnly: true,
  secure: true
}

const generateAccessAndRefreshToken = async (userid) => {

  const user = await User.findById(userid);

  const accessToken = await user.accessTokenGenerator()
  const refreshToken = await user.refreshTokenGenerator()

  user.refreshToken = refreshToken;  // overrighting 
  await user.save({ validateBeforeSave: false })

  return { accessToken, refreshToken }

}

const registerUser = asyncHandler(async (req, res, _) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res


  // get user details from frontend
  const { fullName, email, password, username } = req.body

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required")
  }


  // check if user already exists: username, email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists")
  }

  // check for images, check for avatar
  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required")
  }
  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new apiError(400, "Avatar file is required")
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  // check for user creation
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user")
  }


  // return res

  return res.status(201).json(
    new apiResponse(200, createdUser, "User registered Successfully")
  )


})

const loginUser = asyncHandler(async (req, res) => {
  //get data from req.body
  //verify data , username or email
  //find user against username or email
  // check password 
  // genearte access and refresh token
  // set cookie for both tokens 
  // send res

  const { username, password, email } = req.body;
  // console.log(req.body);


  if (!username || !email) {
    throw new apiError(400, "Username or email must required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new apiError(401, "User does not exist")
  }

  const isPasswordCorrect = user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new apiError(401, "Invalid credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-refreshToken -password")

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "User login successfully",
      user: loggedInUser, accessToken, refreshToken,
    });

})

const logoutUser = asyncHandler(async (req, res) => {
  // we need user id to get logged in user . for this we'll use middleware 

  await User.findOneAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this will remove this field
      }
    },
    {
      new: true
    }
  )


  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new apiResponse(
        200,
        {},
        "User Log out Succesfulyy"
      )
    )

})

const generateNewAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized Access")
  }

  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!decodedRefreshToken) {
      throw new apiError(400, "Invalid Refresh token")
    }

    const user = await User.findById(decodedRefreshToken._id);
    if (!user) {
      throw new apiError(400, "Invalid Refresh token")
    }

    if (incomingRefreshToken !== user.refreshToken) {  // compare incoming token with sotred user from db
      throw new apiError(400, "Invalid Refresh token")
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Tokne refresh successfuly"
        )
      )
  } catch (error) {
throw new apiError(401 , error?.message , "Something went wronge while creating new accesstoken")
  }

})



export { registerUser, loginUser, logoutUser, generateNewAccessToken };
