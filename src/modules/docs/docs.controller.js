import { generateReadmeService } from "./docs.service.js";

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