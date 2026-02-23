import { env } from "./env.js";

export const githubConfig = {
  clientId: env.githubClientId,
  clientSecret: env.githubClientSecret,
  callbackUrl: env.githubCallbackUrl,
};