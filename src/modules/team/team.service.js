import TeamModel from "./team.model.js";
import UserModel from "../../models/user.model.js";

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
   ADD MEMBER
====================== */
export const addMemberService = async (
  currentUserId,
  teamId,
  newUserId,
  role = "member"
) => {
  const team = await TeamModel.findOne({
    _id: teamId,
    "members.user": currentUserId,
  });

  if (!team) {
    throw new Error("Team not found or access denied");
  }

  const userExists = await UserModel.findById(newUserId);
  if (!userExists) {
    throw new Error("User does not exist");
  }

  const alreadyMember = team.members.find(
    (m) => m.user.toString() === newUserId
  );

  if (alreadyMember) {
    throw new Error("User already a member");
  }

  if (!["admin", "member"].includes(role)) {
    role = "member";
  }

  team.members.push({
    user: newUserId,
    role,
  });

  await team.save();

  return team.populate("members.user", "fullName email");
};
