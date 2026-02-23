import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  stripeWebhook,
} from "./billing.controller.js";

const router = Router();

router.post("/checkout", protect, createCheckoutSession);
router.post("/webhook", stripeWebhook);

export default router;
