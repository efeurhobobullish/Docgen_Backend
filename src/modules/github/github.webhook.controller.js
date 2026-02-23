import RepositoryModel from "../repo/repo.model.js";
import { generateReadmeService } from "../docs/docs.service.js";

export const githubWebhook = async (req, res) => {
  try {
    const event = req.headers["x-github-event"];

    // Only react to push events
    if (event !== "push") {
      return res.status(200).json({ message: "Event ignored" });
    }

    const { repository } = req.body;

    if (!repository) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const repo = await RepositoryModel.findOne({
      fullName: repository.full_name,
    });

    if (!repo) {
      return res.status(200).json({ message: "Repo not connected" });
    }

    // Auto regenerate README
    await generateReadmeService(repo.user, repo._id);

    res.status(200).json({ message: "Documentation regenerated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
