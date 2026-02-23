import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import githubRoutes from "./modules/github/github.routes.js";
import docsRoutes from "./modules/docs/docs.routes.js";
import billingRoutes from "./modules/billing/billing.routes.js";

import { protect } from "./middlewares/auth.middleware.js";

const app = express();

/* ======================
   SECURITY MIDDLEWARE
====================== */
app.use(helmet());
app.use(cors());

/* ======================
   RAW BODY FOR WEBHOOKS
   (MUST come BEFORE express.json)
====================== */
app.use(
  "/api/github/webhook",
  express.raw({ type: "application/json" })
);

app.use(
  "/api/billing/webhook",
  express.raw({ type: "application/json" })
);

/* ======================
   JSON BODY PARSER
====================== */
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/billing", billingRoutes);

/* ======================
   TEST PROTECTED ROUTE
====================== */
app.get("/api/protected", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

/* ======================
   ROOT
====================== */
app.get("/", (req, res) => {
  res.json({
    message: "DocGen API running 🚀",
    status: "OK",
  });
});

/* ======================
   HEALTH CHECK
====================== */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;