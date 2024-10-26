import { Router } from "express";
import { createEvent, getAllEvents } from "../controllers/events.controller.js";

const router = Router();

router.route("/all_events").get(getAllEvents);
router.route("/add_event").post(createEvent);

export default router;
