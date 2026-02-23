import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { generateReadme } from "./docs.controller.js";

const router = Router();

router.post("/:repoId/generate-readme", protect, generateReadme);

export default router;