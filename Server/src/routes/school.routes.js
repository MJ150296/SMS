import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  isSchoolExists,
  schoolProfileUpdate,
} from "../controllers/school.controller.js";
import { superAdmin } from "../middleware/superAdmin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/update")
  .post(verifyJWT, superAdmin, upload.single("logoUrl"), schoolProfileUpdate);
router.route("/checkIfSchoolExists").get(verifyJWT, superAdmin, isSchoolExists);
router.route("/profile").get(isSchoolExists);

export default router;
