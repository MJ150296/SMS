import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { teacherSalaryStructure } from "../controllers/teacherSalaryStructure.controller.js";
import { adminSalaryStructure } from "../controllers/adminSalaryStructure.controller.js";

const router = Router();

router.route("/teacher_salary_structure").post(verifyJWT, teacherSalaryStructure);
router.route("/admin_salary_structure").post(verifyJWT, adminSalaryStructure);

export default router;
