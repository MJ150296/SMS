import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Class } from "../models/class.model.js";
import Teacher from "../models/teacher.model.js";

// Controller function to get all classes
const getAllClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await Class.find({});

    if (!classes || classes.length === 0) {
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
    console.error("Error in getAllClasses controller function", error);
    throw new ApiError(500, "Error in getAllClasses controller function");
  }
});

// Controller function to update the class teacher
const updateClassTeacher = asyncHandler(async (req, res) => {
  const { classId } = req.params; // Get classId from URL params
  const { classTeacher } = req.body; // Get teacherId from request body

  // console.log(classId, "Teacher ID", classTeacher);

  try {
    // Validate input
    if (!classId || !classTeacher) {
      return res
        .status(400)
        .json({ message: "Class ID and Teacher ID are required." });
    }

    // Find the class
    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Optional: Validate if the teacher exists
    const teacherExists = await Teacher.findById(classTeacher);
    if (!teacherExists) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    // Update the class teacher
    classToUpdate.classTeacher = classTeacher;

    // Save the updated class
    await classToUpdate.save();

    // Return the updated class
    return res.status(200).json({
      message: "Class teacher updated successfully.",
      data: classToUpdate,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "An error occurred while updating the class teacher.",
      error: error.message,
    });
  }
});

export { getAllClasses, updateClassTeacher };
