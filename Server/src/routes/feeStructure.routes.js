import { Router } from "express";
import { createFeeStructure } from "../controllers/fees.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/fee_structures").post(verifyJWT, createFeeStructure);

export default router;
