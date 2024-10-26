import { Router } from "express";
import { getAllAdmins } from "../controllers/admin.controller.js";

const router = Router();

router.route("/all_admins").get(getAllAdmins);

export default router;
