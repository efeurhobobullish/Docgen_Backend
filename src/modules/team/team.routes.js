import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createTeam,
  getUserTeams,
  addMember,
} from "./team.controller.js";

const router = Router();

router.post("/", protect, createTeam);
router.get("/", protect, getUserTeams);
router.post("/:teamId/members", protect, addMember);

export default router;
