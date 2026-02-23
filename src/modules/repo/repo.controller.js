import {
  connectRepoService,
  getUserReposService,
  disconnectRepoService,
} from "./repo.service.js";

export const connectRepo = async (req, res) => {
  try {
    const repo = await connectRepoService(req.user.id, req.body);
    res.status(201).json(repo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getConnectedRepos = async (req, res) => {
  try {
    const repos = await getUserReposService(req.user.id);
    res.status(200).json(repos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const disconnectRepo = async (req, res) => {
  try {
    const result = await disconnectRepoService(
      req.user.id,
      req.params.repoId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};