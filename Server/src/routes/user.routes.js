import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getAllUserData,
  getUserCount,
  loginUser,
  logoutUser,
  registerSuperAdmin,
  userProfileUpdate,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register-superadmin").post(registerSuperAdmin);
router.route("/user_login").post(loginUser);
router.route("/user_logout").post(verifyJWT, logoutUser);
router.route("/isSuperAdminRegistered").get(getUserCount);
router.route("/all_users").get(verifyJWT, getAllUserData);
router.route("/update_user_profile").put(verifyJWT, upload.single('avatar'), userProfileUpdate);



export default router;
