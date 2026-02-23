import RepositoryModel from "../repo/repo.model.js";
import DocumentModel from "./docs.model.js";
import { getRepoTreeService } from "../repo/repo.service.js";
import { analyzeRepository } from "../../utils/repoAnalyzer.js";
import { generateReadmeAI } from "../../utils/ai.js";

/* ======================
   GENERATE README
====================== */
export const generateReadmeService = async (userId, repoId) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  const files = await getRepoTreeService(userId, repoId);
  const analysis = analyzeRepository(files);

  const content = await generateReadmeAI({
    name: repository.name,
    analysis,
    files,
  });

  const lastDoc = await DocumentModel.findOne({
    repository: repoId,
    type: "readme",
  }).sort({ version: -1 });

  const version = lastDoc ? lastDoc.version + 1 : 1;

  const document = await DocumentModel.create({
    repository: repoId,
    type: "readme",
    version,
    content,
  });

  return document;
await UserModel.findByIdAndUpdate(userId, {
  $inc: { "usage.readmeGenerations": 1 },
});
};

/* ======================
   GET LATEST README
====================== */
export const getLatestDocService = async (userId, repoId) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  const doc = await DocumentModel.findOne({
    repository: repoId,
    type: "readme",
  }).sort({ version: -1 });

  if (!doc) {
    throw new Error("No documentation found");
  }

  return doc;
};

/* ======================
   GET ALL VERSIONS
====================== */
export const getAllVersionsService = async (userId, repoId) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  return DocumentModel.find({
    repository: repoId,
    type: "readme",
  }).sort({ version: -1 });
};

/* ======================
   GET SPECIFIC VERSION
====================== */
export const getSpecificVersionService = async (
  userId,
  repoId,
  version
) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  const doc = await DocumentModel.findOne({
    repository: repoId,
    type: "readme",
    version,
  });

  if (!doc) {
    throw new Error("Version not found");
  }

  return doc;
};

/* ======================
   DELETE VERSION
====================== */
export const deleteVersionService = async (
  userId,
  repoId,
  version
) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  const deleted = await DocumentModel.findOneAndDelete({
    repository: repoId,
    type: "readme",
    version,
  });

  if (!deleted) {
    throw new Error("Version not found");
  }

  return { message: "Version deleted successfully" };
};

export const generateChangelogService = async (
  userId,
  repoId
) => {
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    user: userId,
  });

  if (!repository) throw new Error("Repository not found");

  const user = await UserModel.findById(userId).select("+githubAccessToken");

  const commits = await fetchCommits(
    user.githubAccessToken,
    repository.fullName
  );

  const changelog = await generateChangelogAI(commits);

  await UserModel.findByIdAndUpdate(userId, {
    $inc: { "usage.changelogGenerations": 1 },
  });

  return { changelog };
};