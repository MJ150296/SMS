import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary and delete local file after upload
const uploadToCloudinary = async (filePath, folderPath) => {
  try {
    if (!filePath) {
      throw new Error("File path is not valid.");
    }

    const folder = `SMS/${folderPath}`;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      folder: folder, // You can specify any folder, default is 'avatars'
      resource_type: "auto", // Auto-detect file type
    });

    // Delete the local file after successful upload
    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    // Ensure local file is deleted even if an error occurs
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Error during Cloudinary upload:", error.message);
    return null;
  }
};

export { uploadToCloudinary };
