import {
  createTeamService,
  getUserTeamsService,
  addMemberService,
} from "./team.service.js";

/* ======================
   CREATE TEAM
====================== */
export const createTeam = async (req, res) => {
  try {
    const team = await createTeamService(
      req.user.id,
      req.body.name
    );
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
   ADD MEMBER
====================== */
export const addMember = async (req, res) => {
  try {
    const team = await addMemberService(
      req.user.id,
      req.params.teamId,
      req.body.userId,
      req.body.role
    );

    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
