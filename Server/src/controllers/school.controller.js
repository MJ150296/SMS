import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { School } from "../models/school.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

const schoolProfileUpdate = asyncHandler(async (req, res, next) => {
  // console.log("in school profile update");
  
  try {
    // Extract and transform the incoming request body
    const {
      name,
      "address.street": street,
      "address.city": city,
      "address.state": state,
      "address.postalCode": postalCode,
      "address.country": country,
      contactNumber,
      email,
      website,
      establishedYear,
      schoolType,
      affiliatedBoard,
      "principal.fullName": principalFullName,
      "principal.contactNumber": principalContactNumber,
      "principal.email": principalEmail,
    } = req.body;

    // Manual validation of required fields
    const requiredFields = [
      name,
      street,
      city,
      state,
      postalCode,
      contactNumber,
      email,
      principalFullName,
      principalContactNumber,
    ];

    const missingFields = requiredFields.filter((field) => !field);
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Transform the flattened fields into a nested structure
    const schoolData = {
      name,
      address: {
        street,
        city,
        state,
        postalCode,
        country,
      },
      contactNumber,
      email,
      website,
      establishedYear,
      schoolType,
      affiliatedBoard,
      principal: {
        fullName: principalFullName,
        contactNumber: principalContactNumber,
        email: principalEmail,
      },
    };

    let logoUrl = "";
    // Handle file upload for the logoUrl
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(
        req.file.path,
        `${name}/Logo`
      );
      if (!cloudinaryResult) {
        return res.status(400).json({ message: "Failed to upload avatar" });
      }
      logoUrl = cloudinaryResult.secure_url; // Get the avatar URL from Cloudinary
    }

    // console.log(logoUrl);
    if (logoUrl) {
      schoolData.logoUrl = logoUrl;
    }
    // console.log(schoolData);

    const count = await School.countDocuments();
    // console.log(count);

    if (count === 0) {
      // Create the school profile in the database
      const createdSchool = await School.create(schoolData);

      // console.log(createdSchool);
      if (!createdSchool) {
        return res.status(404).json({ message: "School could not be updated" });
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { school: createdSchool },
            "School Profile updated successfully"
          )
        );
    } else {
      // console.log("in for updation");

      const sanitizedSchoolData = Object.fromEntries(
        Object.entries(schoolData).filter(([key, value]) => value !== undefined)
      );

      // console.log("Sanitised data", sanitizedSchoolData);

      const school = await School.findOne({});

      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      // Update the existing school profile using set and save
      school.set(sanitizedSchoolData); // Update fields in memory
      const updatedSchool = await school.save(); // Persist the changes to the database

      // console.log("Updated school", updatedSchool);

      if (!updatedSchool) {
        return res.status(500).json({ message: "School could not be updated" });
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          { school: updatedSchool }, // Return the updated school data
          "School Profile updated successfully"
        )
      );
    }

    // console.log(schoolData);

    // let school = await School.findOne({}); // This finds the first document in the School collection

    // if (!school) {
    //   // If no school exists, create a new one
    //   school = new School(schoolData);

    //   console.log("Created School", school);
    //   return res.status(201).json({
    //     success: true,
    //     data: school,
    //     message: "School profile created successfully",
    //   });
    // } else {
    //   // If a school exists, update it
    //   Object.assign(school, schoolData);
    //   const updatedSchool = await School.findOne({});
    //   console.log("Updated School", updatedSchool);
    // }
  } catch (error) {
    // Catch any errors and respond with an error message
    return res.status(500).json({
      success: false,
      message: "Server error occurred",
      error: error.message,
    });
  }
});

const isSchoolExists = asyncHandler(async (req, res, next) => {
  try {
    const count = await School.countDocuments();

    if (count > 0) {
      const schoolProfile = await School.findOne(); // Get the first school document
      return res.status(200).json({ schoolExists: true, schoolProfile });
    } else {
      return res.status(200).json({ schoolExists: false });
    }
  } catch (error) {
    console.error("Error checking school documents:", error);
    return res.status(500).json({ message: "Error checking school documents" });
  }
});

export { schoolProfileUpdate, isSchoolExists };
