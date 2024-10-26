import { Router } from "express";
import { getAllTeachers } from "../controllers/teacher.controller.js";

const router = Router();

router.route("/all_teachers").get(getAllTeachers);

export default router;
