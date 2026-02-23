import TeamModel from "../modules/team/team.model.js";

export const requireTeamRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const teamId = req.params.teamId;
      const userId = req.user.id;

      const team = await TeamModel.findOne({
        _id: teamId,
        "members.user": userId,
      });

      if (!team) {
        return res.status(403).json({
          message: "Access denied. Not a team member.",
        });
      }

      const member = team.members.find(
        (m) => m.user.toString() === userId
      );

      if (!allowedRoles.includes(member.role)) {
        return res.status(403).json({
          message: "Insufficient permissions.",
        });
      }

      req.team = team;
      req.teamRole = member.role;

      next();
    } catch (error) {
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};