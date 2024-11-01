import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import Admin from "../models/admin.model.js"; // Assuming you have an Admin model

const getAllAdmins = asyncHandler(async (req, res) => {
  try {
    // Fetch all admins from the database
    const admins = await Admin.find({});

    // console.log(admins); // Log fetched admins for debugging

    // Send the admins data as a response
    return res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: admins,
        message: "Successfully fetched all Admin data",
      })
    );
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching all Admin data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch Admin data",
    });
  }
});

export { getAllAdmins };
