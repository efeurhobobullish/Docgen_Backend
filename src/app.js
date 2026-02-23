import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import githubRoutes from "./modules/github/github.routes.js";
import docsRoutes from "./modules/docs/docs.routes.js";

import { protect } from "./middlewares/auth.middleware.js";

const app = express();

/* ======================
   SECURITY MIDDLEWARE
====================== */
app.use(helmet());
app.use(cors());

/* ======================
   WEBHOOK RAW BODY
   (MUST come before express.json)
====================== */
app.use(
  "/api/github/webhook",
  express.raw({ type: "application/json" })
);

/* ======================
   BODY PARSER
====================== */
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/docs", docsRoutes);

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
  res.json({ message: "DocGen API running 🚀" });
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