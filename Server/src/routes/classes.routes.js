import { Router } from "express";
import { getAllClasses, updateClassTeacher } from "../controllers/classes.controller.js";

const router = Router();

router.route("/all_classes").get(getAllClasses)

// Route for updating the class teacher
router.patch('/updateClassTeacher/:classId', updateClassTeacher);

export default router;
