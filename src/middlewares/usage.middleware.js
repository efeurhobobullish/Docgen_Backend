import UserModel from "../models/user.model.js";

export const checkUsageLimit = (type) => {
  return async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);

    const limits = {
      free: {
        readmeGenerations: 5,
        prSummaries: 10,
        changelogGenerations: 5,
      },
      pro: {
        readmeGenerations: 100,
        prSummaries: 200,
        changelogGenerations: 100,
      },
    };

    const limit = limits[user.plan][type];

    if (user.usage[type] >= limit) {
      return res.status(403).json({
        message: "Usage limit reached. Upgrade your plan.",
      });
    }

    next();
  };
};