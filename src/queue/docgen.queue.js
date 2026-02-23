import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const docgenQueue = new Queue("docgen", {
  connection: redisConnection,
});
