import multer from "multer";
import path from "path";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  // Set the destination folder
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Temporary folder for file storage
  },
  // Set the filename, appending Date.now() for uniqueness
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // Set file size limit to 15 MB
  },
  // Filter files by type to allow only .jpeg, .jpg, .png formats
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    ); // Check extension
    const mimetype = fileTypes.test(file.mimetype); // Check mimetype
    // Allow only if the file matches the expected types
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, or .png images are allowed!"));
    }
  },
});
