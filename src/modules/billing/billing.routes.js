import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  createCustomerPortal,
  stripeWebhook,
} from "./billing.controller.js";

const router = Router();

router.post("/checkout", protect, createCheckoutSession);
router.post("/webhook", stripeWebhook);
router.post("/portal", protect, createCustomerPortal);

export default router;
