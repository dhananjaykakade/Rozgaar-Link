import express from "express";
import { getNearbyJobs } from "../controllers/workerController.js";

const router = express.Router();

// ✅ Route to Get Nearby Jobs
router.get("/nearby-jobs/:workerId/:radiusKm", getNearbyJobs);

export default router;
