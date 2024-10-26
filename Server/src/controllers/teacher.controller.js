import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import Teacher from "../models/teacher.model.js"; 

const getAllTeachers = asyncHandler(async (req, res) => {
  try {
    // Fetch all teachers from the database
    const teachers = await Teacher.find({});

    // console.log(teachers); // Log fetched teachers for debugging

    // Send the teachers data as a response
    return res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: teachers,
        message: "Successfully fetched all Teacher data",
      })
    );
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching all Teacher data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch Teacher data",
    });
  }
});

export { getAllTeachers };
