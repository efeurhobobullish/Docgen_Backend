import crypto from "crypto";
import RepositoryModel from "../repo/repo.model.js";
import { generateReadmeService } from "../docs/docs.service.js";

export const githubWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!signature) {
      return res.status(401).json({ message: "No signature provided" });
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest =
      "sha256=" +
      hmac.update(req.body).digest("hex");

    if (signature !== digest) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = req.headers["x-github-event"];

    if (event !== "push") {
      return res.status(200).json({ message: "Event ignored" });
    }

    const payload = JSON.parse(req.body.toString());
    const { repository } = payload;

    const repo = await RepositoryModel.findOne({
      fullName: repository.full_name,
    });

    if (!repo) {
      return res.status(200).json({ message: "Repo not connected" });
    }

    await generateReadmeService(repo.user, repo._id);

    res.status(200).json({ message: "Documentation regenerated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
