import RepositoryModel from "../repo/repo.model.js";
import DocumentModel from "./docs.model.js";
import { getRepoTreeService } from "../repo/repo.service.js";
import { analyzeRepository } from "../../utils/repoAnalyzer.js";
import { generateReadmeAI } from "../../utils/ai.js";

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
};