import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { teacherSalaryStructure } from "../controllers/teacherSalaryStructure.controller.js";
import { adminSalaryStructure } from "../controllers/adminSalaryStructure.controller.js";
import {
  addSalaryPayment,
  fetchSalaryPayment,
  updateSalaryPayment,
} from "../controllers/Payment/salaryPayment.controller.js";

const router = Router();

router
  .route("/teacher_salary_structure")
  .post(verifyJWT, teacherSalaryStructure);

router.route("/admin_salary_structure").post(verifyJWT, adminSalaryStructure);

router.route("/payment/add_salary_payment").get(verifyJWT, addSalaryPayment);

router
  .route("/payment/fetch_salary_payment/:teacherId")
  .get(verifyJWT, fetchSalaryPayment);

router
  .route("/payment/update_salary_payment")
  .patch(verifyJWT, updateSalaryPayment);

export default router;
