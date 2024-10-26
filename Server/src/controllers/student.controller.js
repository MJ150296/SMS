import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import Student from "../models/student.model.js";

const getAllStudents = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find({});

    // console.log(students);
    

    // Send the students data as a response
    return res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: students,
        message: "Successfully fetched all Student data",
      })
    );
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching all Student data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch Student data",
    });
  }
});

export { getAllStudents };
