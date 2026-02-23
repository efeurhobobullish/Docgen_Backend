import { Router } from "express";
import {
  redirectToGithub,
  githubCallback,
} from "./github.controller.js";

const router = Router();

router.get("/auth", redirectToGithub);
router.get("/callback", githubCallback);

export default router;