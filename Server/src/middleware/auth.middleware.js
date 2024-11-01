import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // console.log("in aut middleware");
  
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      
    if (!token) {
      // console.log("No token");
      
      throw new ApiError(401, "Unauthorized request");
    }
    // console.log("token , ", token);
    

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!decodedToken){
      throw new ApiError(558, "Decoded token not found")
    }

    // console.log(decodedToken?._id);
    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    if (!user) {
      return new ApiError(401, "Invalid Access Token");
    }

    // console.log(user);
    

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(429, "in Catch \t", error?.message);
  }
});
