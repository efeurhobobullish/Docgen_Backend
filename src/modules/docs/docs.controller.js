import {
  generateReadmeService,
  getLatestDocService,
  getAllVersionsService,
  getSpecificVersionService,
  deleteVersionService,
} from "./docs.service.js";

/* ======================
   GENERATE README
====================== */
export const generateReadme = async (req, res) => {
  try {
    const doc = await generateReadmeService(
      req.user.id,
      req.params.repoId
    );

    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   GET LATEST README
====================== */
export const getLatestDoc = async (req, res) => {
  try {
    const doc = await getLatestDocService(
      req.user.id,
      req.params.repoId
    );

    res.status(200).json(doc);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* ======================
   GET ALL VERSIONS
====================== */
export const getAllVersions = async (req, res) => {
  try {
    const docs = await getAllVersionsService(
      req.user.id,
      req.params.repoId
    );

    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   GET SPECIFIC VERSION
====================== */
export const getSpecificVersion = async (req, res) => {
  try {
    const doc = await getSpecificVersionService(
      req.user.id,
      req.params.repoId,
      Number(req.params.version)
    );

    res.status(200).json(doc);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* ======================
   DELETE VERSION
====================== */
export const deleteVersion = async (req, res) => {
  try {
    const result = await deleteVersionService(
      req.user.id,
      req.params.repoId,
      Number(req.params.version)
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
