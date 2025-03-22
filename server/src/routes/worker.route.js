import express from "express";
import {getWorkers,getWorkerById} from "../controller/worker/workerController.js"
const router = express.Router();

// Get all workers
router.get("/", getWorkers);
router.get("/:id", getWorkerById);



export default router;
