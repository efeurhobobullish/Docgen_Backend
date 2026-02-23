import { fetchUserRepos } from "./github.service.js";
import UserModel from "../../models/user.model.js";
import { githubConfig } from "../../config/github.js";
import { handleGithubAuth } from "./github.service.js";

export const redirectToGithub = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}&scope=repo,user`;

  res.redirect(url);
};

export const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Code not provided" });
    }

    const tokens = await handleGithubAuth(code);

    res.status(200).json(tokens);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRepos = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("+githubAccessToken");

    if (!user || !user.githubAccessToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const repos = await fetchUserRepos(user.githubAccessToken);

    res.status(200).json(repos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
