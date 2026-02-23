import TeamModel from "./team.model.js";

/* ======================
   CREATE TEAM
====================== */
export const createTeamService = async (userId, name) => {
  const team = await TeamModel.create({
    name,
    owner: userId,
    members: [
      {
        user: userId,
        role: "owner",
      },
    ],
  });

  return team;
};

/* ======================
   GET USER TEAMS
====================== */
export const getUserTeamsService = async (userId) => {
  return TeamModel.find({
    "members.user": userId,
  }).populate("members.user", "fullName email");
};

/* ======================
   INVITE MEMBER
====================== */
export const addMemberService = async (
  userId,
  teamId,
  newUserId,
  role
) => {
  const team = await TeamModel.findOne({
    _id: teamId,
    "members.user": userId,
  });

  if (!team) {
    throw new Error("Team not found or access denied");
  }

  team.members.push({
    user: newUserId,
    role: role || "member",
  });

  await team.save();

  return team;
};
