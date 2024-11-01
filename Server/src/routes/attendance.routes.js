import { Router } from "express";
import {
  addOrUpdateAttendance,
  getMonthlyAttendanceSummary,
} from "../controllers/attendance.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/add_attendance").post(verifyJWT, addOrUpdateAttendance);
router.route("/summary").get(getMonthlyAttendanceSummary);

export default router;
