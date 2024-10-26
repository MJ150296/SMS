import { Router } from "express";
import { getAllStudents } from "../controllers/student.controller.js";

const router = Router();

router.route("/all_students").get(getAllStudents);

export default router;
