import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import githubRoutes from "./modules/github/github.routes.js";
import { protect } from "./middlewares/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

/* ======================
   ROUTES
====================== */

app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);

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

export default app;