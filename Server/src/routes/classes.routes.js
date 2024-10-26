import { Router } from "express";
import { getAllClasses } from "../controllers/classes.controller.js";

const router = Router();

router.route("/all_classes").get(getAllClasses)

export default router;
