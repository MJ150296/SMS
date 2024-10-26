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

    //Delete the previous file on cloudinary

    const checkImagesOnCloudinary = await cloudinary.api.resources({
      type: "upload", // We are checking uploaded files
      prefix: folder, // Folder path to search in
      resource_type: "image", // Filter for image files
    });

    // Check if the folder contains any image resources

    if (
      checkImagesOnCloudinary.resources &&
      checkImagesOnCloudinary.resources.length > 0
    ) {
      console.log(`Folder '${folder}' exists and contains image files.`);

      // Iterate through the images and delete each one using cloudinary.v2.uploader.destroy
      for (const resource of checkImagesOnCloudinary.resources) {
        const publicId = resource.public_id;

        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image", // Ensure you are deleting an image
          });
          console.log(`Image with public ID '${publicId}' has been deleted.`);
        } catch (error) {
          console.error(
            `Failed to delete image with public ID '${publicId}':`,
            error
          );
        }
      }
      console.log(`Images in folder '${folder}' have been deleted.`);
    } else {
      // If no images are found, the folder might still exist (but be empty)
      console.log(`Folder '${folder}' exists but does not contain any images.`);
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      folder: folder, // You can specify any folder,
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

// const checkIfFolderAndImagesExist = async (folderPath) => {
//   try {
//     const folder = `SMS/${folderPath}`;

//     // Use the Cloudinary Admin API to list resources in the folder
//     const response = await cloudinary.api.resources({
//       type: "upload",  // We are checking uploaded files
//       prefix: folder,  // Folder path to search in
//       resource_type: "image",  // Filter for image files
//     });

//     // Check if the folder contains any image resources
//     if (response.resources && response.resources.length > 0) {
//       console.log(`Folder '${folder}' exists and contains image files.`);

//       // Delete the images if they exist
//       await deleteImages(response.resources);
//       console.log(`Images in folder '${folder}' have been deleted.`);

//       return {
//         folderExists: true,
//         hasImages: true,
//       };
//     } else {
//       // If no images are found, the folder might still exist (but be empty)
//       console.log(`Folder '${folder}' exists but does not contain any images.`);
//       return {
//         folderExists: true,
//         hasImages: false,
//       };
//     }
//   } catch (error) {
//     if (error.http_code === 404) {
//       // Cloudinary returns a 404 error if the folder or resources don't exist
//       console.log(`Folder '${folder}' does not exist.`);
//       return {
//         folderExists: false,
//         hasImages: false,
//       };
//     } else {
//       console.error("Error checking Cloudinary folder:", error.message);
//       return {
//         folderExists: false,
//         hasImages: false,
//         error: error.message,
//       };
//     }
//   }
// };

// // Function to delete images
// const deleteImages = async (resources) => {
//   try {
//     const publicIds = resources.map((resource) => resource.public_id);

//     // Use Cloudinary's destroy method to delete each image by public ID
//     const deleteResponse = await cloudinary.api.delete_resources(publicIds, {
//       resource_type: "image",  // Only delete images
//     });

//     console.log('Deleted images:', deleteResponse);
//   } catch (error) {
//     console.error('Error deleting images:', error.message);
//   }
// };

// export { checkIfFolderAndImagesExist };
