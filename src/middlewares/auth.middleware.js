import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
   try {
       // Get token from cookies or Authorization header
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

       if (!token) {
           throw new ApiError(403, "Unauthorized Request: Missing Access Token");
       }

       // Log the token for debugging purposes (be cautious with logging sensitive data in production)
       console.log("Token received:", token);

       // Verify token
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

       // Log the decoded token
       console.log("Decoded Token:", decodedToken);

       // Find user in database
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
       if (!user) {
           throw new ApiError(401, "Invalid Access Token: User not found");
       }

       // Attach user to request
       req.user = user;
       next();
   } catch (error) {
       // More detailed logging for error
       console.error("Error during token verification:", error);

       if (error.name === "JsonWebTokenError") {
           throw new ApiError(401, "Invalid Access Token");
       } else if (error.name === "TokenExpiredError") {
           throw new ApiError(401, "Access Token Expired");
       } else {
           throw new ApiError(500, "Server Error in Token Verification");
       }
   }
});

