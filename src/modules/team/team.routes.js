import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireTeamRole } from "../../middlewares/teamRole.middleware.js";

import {
  createTeam,
  getUserTeams,
  getSingleTeam,
  addMember,
  removeMember,
  deleteTeam,
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
   GET SINGLE TEAM
====================== */
router.get("/:teamId", protect, getSingleTeam);

/* ======================
   ADD MEMBER (Owner/Admin)
====================== */
router.post(
  "/:teamId/members",
  protect,
  requireTeamRole(["owner", "admin"]),
  addMember
);

/* ======================
   REMOVE MEMBER (Owner only)
====================== */
router.delete(
  "/:teamId/members/:userId",
  protect,
  requireTeamRole(["owner"]),
  removeMember
);

/* ======================
   DELETE TEAM (Owner only)
====================== */
router.delete(
  "/:teamId",
  protect,
  requireTeamRole(["owner"]),
  deleteTeam
);

export default router;
