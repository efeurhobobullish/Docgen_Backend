import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  generateReadme,
  getLatestDoc,
  getAllVersions,
  getSpecificVersion,
  deleteVersion,
} from "./docs.controller.js";

const router = Router();

/* ======================
   GENERATE README
====================== */
router.post("/:repoId/generate-readme", protect, generateReadme);

/* ======================
   GET LATEST README
====================== */
router.get("/:repoId", protect, getLatestDoc);

/* ======================
   GET ALL VERSIONS
====================== */
router.get("/:repoId/versions", protect, getAllVersions);

/* ======================
   GET SPECIFIC VERSION
====================== */
router.get(
  "/:repoId/version/:version",
  protect,
  getSpecificVersion
);

/* ======================
   DELETE VERSION
====================== */
router.delete(
  "/:repoId/version/:version",
  protect,
  deleteVersion
);

export default router;
