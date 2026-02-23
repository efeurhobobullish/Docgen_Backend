import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  connectRepo,
  getConnectedRepos,
  disconnectRepo,
} from "./repo.controller.js";

const router = Router();

router.post("/connect", protect, connectRepo);
router.get("/", protect, getConnectedRepos);
router.delete("/:repoId", protect, disconnectRepo);

export default router;