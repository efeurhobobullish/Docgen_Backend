import axios from "axios";
import UserModel from "../../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";
import { githubConfig } from "../../config/github.js";

export const getGithubAccessToken = async (code) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: githubConfig.clientId,
      client_secret: githubConfig.clientSecret,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  return response.data.access_token;
};

export const getGithubUser = async (accessToken) => {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const handleGithubAuth = async (code) => {
  const githubToken = await getGithubAccessToken(code);
  const githubUser = await getGithubUser(githubToken);

  let user = await UserModel.findOne({ githubId: githubUser.id });

  if (!user) {
    user = await UserModel.create({
      fullName: githubUser.name || githubUser.login,
      email: githubUser.email,
      provider: "github",
      githubId: githubUser.id,
      githubUsername: githubUser.login,
      githubAccessToken: githubToken,
      avatar: githubUser.avatar_url,
    });
  } else {
    user.githubAccessToken = githubToken;
    await user.save();
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};