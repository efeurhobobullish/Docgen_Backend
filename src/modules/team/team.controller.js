import {
  createTeamService,
  getUserTeamsService,
  addMemberService,
} from "./team.service.js";

import TeamModel from "./team.model.js";

/* ======================
   CREATE TEAM
====================== */
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await createTeamService(req.user.id, name);

    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   GET USER TEAMS
====================== */
export const getUserTeams = async (req, res) => {
  try {
    const teams = await getUserTeamsService(req.user.id);
    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   GET SINGLE TEAM
====================== */
export const getSingleTeam = async (req, res) => {
  try {
    const team = await TeamModel.findOne({
      _id: req.params.teamId,
      "members.user": req.user.id,
    }).populate("members.user", "fullName email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   ADD MEMBER
====================== */
export const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const team = await addMemberService(
      req.user.id,
      req.params.teamId,
      userId,
      role
    );

    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   REMOVE MEMBER
====================== */
export const removeMember = async (req, res) => {
  try {
    const team = req.team;
    const targetUserId = req.params.userId;

    const member = team.members.find(
      (m) => m.user.toString() === targetUserId
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        message: "Owner cannot be removed",
      });
    }

    team.members = team.members.filter(
      (m) => m.user.toString() !== targetUserId
    );

    await team.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   DELETE TEAM (Owner Only)
====================== */
export const deleteTeam = async (req, res) => {
  try {
    await req.team.deleteOne();

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
