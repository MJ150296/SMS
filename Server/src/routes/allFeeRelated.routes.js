import { Router } from "express";
import { createFeeStructure } from "../controllers/fees.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addFeePayment,
  fetchFeePayment,
  updateFeePayment,
} from "../controllers/Payment/feePayment.controller.js";

const router = Router();

router.route("/fee_structures").post(verifyJWT, createFeeStructure);

router.route("/payment/add_fee_payment").get(verifyJWT, addFeePayment);
router.route("/payment/fetch_fee_payment/:studentId").get(verifyJWT, fetchFeePayment);
router.route("/payment/update_fee_payment").patch(verifyJWT, updateFeePayment);


export default router;
