import { Router } from "express";
import {
  redirectToGithub,
  githubCallback,
  getRepos,
} from "./github.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/auth", redirectToGithub);
router.get("/callback", githubCallback);
router.get("/repos", protect, getRepos);

export default router;
