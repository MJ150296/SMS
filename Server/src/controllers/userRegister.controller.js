import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { User } from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import { Class } from "../models/class.model.js";

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password, department } = req.body;

    // 1. Validate input data
    if (!fullName || !email || !password || !department) {
      throw new ApiError(400, "All fields are required.");
    }

    // 2. Create a new User record
    const user = await User.create({
      fullName,
      email,
      password, // Make sure to hash the password in the User model
      role: "admin",
    });

    // 3. Create a new Admin record
    const admin = await Admin.create({
      userId: user._id, // Link the admin to the created user
      department,
      // You can also add address and other fields here if needed
    });

    console.log("Admin", admin);

    // 4. Return success response
    return res.status(201).json(
      new ApiResponse(201, {
        message: "Admin registered successfully.",
        admin: {
          id: admin._id,
          fullName: user.fullName,
          email: user.email,
          department: admin.department,
          employmentDate: admin.employmentDate,
          // Include additional fields as necessary
        },
      })
    );
  } catch (error) {
    // Handle any errors that occurred during the registration process
    console.error("Error registering admin:", error);
    return res.status(500).json(
      new ApiResponse(500, {
        message: "Internal server error.",
        error: error.message,
      })
    );
  }
});

const registerTeacher = asyncHandler(async (req, res) => {
  const { fullName, email, password, subjectSpecialization } = req.body;

  try {
    // 1. Validate input data
    if (!fullName || !email || !password || !subjectSpecialization) {
      throw new ApiError(
        400,
        "Full name, email, password, and subject specialization are required."
      );
    }

    // 2. Create a new User record
    const user = await User.create({
      fullName,
      email,
      password, // Make sure to hash the password in the User model
      role: "teacher",
    });

    // 3. Generate a unique teacherId (e.g., random or UUID-based)
    const teacherId = `T-${Date.now()}`; // Simple example for generating unique teacherId

    console.log(teacherId);

    // 4. Create a new Teacher record
    const teacher = await Teacher.create({
      userId: user._id, // Link the teacher to the created user
      teacherId,
      subjectSpecialization,
    });

    // 5. Return success response
    return res.status(201).json(
      new ApiResponse(201, {
        message: "Teacher registered successfully.",
        teacher: {
          id: teacher._id,
          fullName: user.fullName,
          email: user.email,
          teacherId: teacher.teacherId,
          subjectSpecialization: teacher.subjectSpecialization,
          employmentDate: teacher.employmentDate,
        },
      })
    );
  } catch (error) {
    console.error("Error registering teacher:", error);
    throw new ApiError(
      500,
      "Internal Server Error. Teacher registration failed."
    );
  }
});

const registerStudent = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    classEnrolled,
    dateOfBirth,
    guardianDetails,
    section, //  section is being sent from the frontend
    academicYear, // academicYear is sent too
  } = req.body;

  try {
    // 1. Validate required fields
    if (!fullName || !email || !password || !classEnrolled || !dateOfBirth) {
      throw new ApiError(
        400,
        "Full name, email, password, class, date of birth are required."
      );
    }

    // 2. Check if the class exists
    let classRecord = await Class.findOne({ className: classEnrolled });

    // 3. If the class doesn't exist, create a new class
    if (!classRecord) {
      classRecord = await Class.create({
        className: classEnrolled, // Assuming you're passing a className or ID in classEnrolled
        section: section || "A", // You can adjust the section logic
        academicYear: academicYear || "2023-2024", // Default academic year if not provided
        students: [], // Start with an empty student array
      });
    }

    // 4. Check if a student with the same full name, email, date of birth, and guardian details exists
    const existingStudent = await Student.findOne({
      fullName,
      email,
      dateOfBirth,
      "guardianDetails.fatherName": guardianDetails.fatherName,
      "guardianDetails.motherName": guardianDetails.motherName,
    });

    if (existingStudent) {
      throw new ApiError(400, "A student with these details already exists.");
    }

    //Count the number of students already enrolled in the class
    const studentCount = await Student.countDocuments({
      classEnrolled: classRecord._id,
    });

    //  Assign the next roll number as count + 1
    const rollNumber = `${studentCount + 1}`; // Roll number will be a string representing the next available number

    // 5. Create a new User record
    const user = await User.create({
      fullName,
      email,
      password, // Ensure password hashing is done in the User model
    });

    // 6. Generate a unique studentId (example based on current timestamp)
    const studentId = `S-${Date.now()}`;

    // 7. Create a new Student record
    const student = await Student.create({
      userId: user._id, // Link the student to the created user
      studentId,
      classEnrolled: classRecord._id,
      rollNumber,
      dateOfBirth,
      guardianDetails: {
        fatherName: guardianDetails.fatherName,
        motherName: guardianDetails.motherName,
        contactNumber: guardianDetails.contactNumber,
        address: {
          street: guardianDetails.address.street,
          city: guardianDetails.address.city,
          state: guardianDetails.address.state,
          postalCode: guardianDetails.address.postalCode,
        },
      },
    });

    // 8. Add the student to the class's students array
    classRecord.students.push(student._id);
    await classRecord.save();

    console.log("Student Created",student);
    

    // 9. Return success response
    return res.status(201).json(
      new ApiResponse(201, {
        message: "Student registered successfully and added to the class.",
        student: {
          id: student._id,
          fullName: user.fullName,
          email: user.email,
          studentId: student.studentId,
          classEnrolled: classRecord.className,
          rollNumber: student.rollNumber,
          dateOfBirth: student.dateOfBirth,
          admissionDate: student.admissionDate,
          guardianDetails: student.guardianDetails,
        },
        class: {
          className: classRecord.className,
          section: classRecord.section,
          academicYear: classRecord.academicYear,
        },
      })
    );
  } catch (error) {
    console.error("Error registering student:", error);
    throw new ApiError(
      500,
      "Internal Server Error. Student registration failed."
    );
  }
});

export { registerAdmin, registerTeacher, registerStudent };
