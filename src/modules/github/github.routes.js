import { Router } from "express";
import {
  redirectToGithub,
  githubCallback,
  getRepos,
  githubWebhook,
} from "./github.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/auth", redirectToGithub);
router.get("/callback", githubCallback);
router.get("/repos", protect, getRepos);
router.post("/webhook", githubWebhook);

export default router;
