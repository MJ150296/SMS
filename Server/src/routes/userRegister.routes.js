import { Router } from "express";
import {
  registerAdmin,
  registerStudent,
  registerTeacher,
} from "../controllers/userRegister.controller.js";

const router = Router();

router.route("/admin").post(registerAdmin);
router.route("/teacher").post(registerTeacher);
router.route("/student").post(registerStudent);

export default router;
