import axios from "axios";
import UserModel from "../../models/user.model.js";
import RepositoryModel from "./repo.model.js";

export const getRepoTreeService = async (userId, repoId) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  const user = await UserModel.findById(userId).select("+githubAccessToken");

  if (!user.githubAccessToken) {
    throw new Error("GitHub not connected");
  }

  const response = await axios.get(
    `https://api.github.com/repos/${repository.fullName}/git/trees/${repository.defaultBranch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
      },
    }
  );

  const files = response.data.tree
    .filter((item) => item.type === "blob")
    .map((item) => item.path);

  return files;
};


export const connectRepoService = async (userId, repoData) => {
  const exists = await RepositoryModel.findOne({
    user: userId,
    repoId: repoData.id,
  });

  if (exists) {
    throw new Error("Repository already connected");
  }

  return RepositoryModel.create({
    user: userId,
    repoId: repoData.id,
    name: repoData.name,
    fullName: repoData.fullName,
    owner: repoData.owner,
    defaultBranch: repoData.defaultBranch,
    isPrivate: repoData.private,
  });
};

export const getUserReposService = async (userId) => {
  return RepositoryModel.find({ user: userId }).sort({ createdAt: -1 });
};

export const disconnectRepoService = async (userId, repoId) => {
  const deleted = await RepositoryModel.findOneAndDelete({
    user: userId,
    _id: repoId,
  });

  if (!deleted) {
    throw new Error("Repository not found");
  }

  return { message: "Repository disconnected" };
};