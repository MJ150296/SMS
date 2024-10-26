import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Class } from "../models/class.model.js";

const getAllClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await Class.find({});

    if (!classes) {
      return new ApiError(404, "Classes not found in the controller function");
    }

   // Send the class data as a response
   return res.status(200).json(
    new ApiResponse(200, {
      success: true,
      data: classes,
      message: "Successfully fetched all class data",
    })
  );
  } catch (error) {
    console.log("Error in getAllClasses controller function", error);
    throw new ApiError(500, "Error in getAllClasses controller function");
  }
});

export { getAllClasses };
