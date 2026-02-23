
import { Worker } from "bullmq";
import { redisConnection } from "./connection.js";
import { generateReadmeService } from "../modules/docs/docs.service.js";

export const docgenWorker = new Worker(
  "docgen",
  async (job) => {
    const { userId, repoId } = job.data;
    await generateReadmeService(userId, repoId);
  },
  { connection: redisConnection }
);
