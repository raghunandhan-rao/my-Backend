import { asyncHandler } from "../utils/asyncHandler.js";
import {UploadImageOnCloudinary} from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../utils/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim === " ")
  ) {
    throw new ApiError(400, "All Fields are Requried");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;
  if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is requried");
  }
  const avatar=await UploadImageOnCloudinary(avatarLocalPath);
  const coverImage= await UploadImageOnCloudinary(coverImageLocalPath);
  if(!avatar){
    throw new ApiError(400,"Failed to upload Avatar");
  }
  const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage: coverImage.url || "",
    username:username.toLowerCase(),
    email,
    password,
  })
  const createdUser=await User.findById(_id).select(
    "-password -refreshTokens"
  )
  if(!createdUser){
    throw new ApiError(500,"Failed to create user something went wrong while entering the user");
  }
  return res.status(201).json(
    new ApiResponse(200, "User Created Successfully", createdUser)
  )
});
export { registerUser };
