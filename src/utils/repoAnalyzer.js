export const analyzeRepository = (files) => {
  const analysis = {
    language: "Unknown",
    framework: "Unknown",
    packageManager: "Unknown",
    type: "Unknown",
  };

  if (files.includes("package.json")) {
    analysis.language = "JavaScript";
    analysis.packageManager = "npm";

    if (files.some(f => f.includes("yarn.lock"))) {
      analysis.packageManager = "yarn";
    }

    if (files.some(f => f.includes("pnpm-lock.yaml"))) {
      analysis.packageManager = "pnpm";
    }

    if (files.some(f => f.includes("next.config.js"))) {
      analysis.framework = "Next.js";
      analysis.type = "Frontend App";
    } else if (files.some(f => f.includes("app.js") || f.includes("server.js"))) {
      analysis.framework = "Express";
      analysis.type = "Backend API";
    } else {
      analysis.framework = "Node.js";
    }
  }

  if (files.some(f => f.endsWith(".py"))) {
    analysis.language = "Python";
    analysis.type = "Backend";
  }

  if (files.some(f => f.endsWith(".ts"))) {
    analysis.language = "TypeScript";
  }

  return analysis;
};