import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  connectRepo,
  getConnectedRepos,
  disconnectRepo,
  getRepoTree,
} from "./repo.controller.js";

const router = Router();

router.post("/connect", protect, connectRepo);
router.get("/", protect, getConnectedRepos);
router.delete("/:repoId", protect, disconnectRepo);
router.get("/:repoId/tree", protect, getRepoTree);

export default router;