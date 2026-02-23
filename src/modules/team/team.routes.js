import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireTeamRole } from "../../middlewares/teamRole.middleware.js";
import {
  createTeam,
  getUserTeams,
  addMember,
} from "./team.controller.js";

const router = Router();

/* ======================
   CREATE TEAM
====================== */
router.post("/", protect, createTeam);

/* ======================
   GET USER TEAMS
====================== */
router.get("/", protect, getUserTeams);

/* ======================
   ADD MEMBER (Owner & Admin only)
====================== */
router.post(
  "/:teamId/members",
  protect,
  requireTeamRole(["owner", "admin"]),
  addMember
);

export default router;
