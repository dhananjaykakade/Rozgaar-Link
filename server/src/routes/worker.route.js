import express from "express";
import {getWorkers,getWorkerById,uploadWorkerDocument,getWorkersWithQuery} from "../controller/worker/workerController.js"
const router = express.Router();
import upload from '../utils/multerConfig.js';

// Get all workers
router.get("/", getWorkers);
router.get("/:id", getWorkerById);
router.get("/", getWorkersWithQuery);
router.post('/:id', upload.fields([
    { name: 'IdProof', maxCount: 1 },
    { name: 'AddressProof', maxCount: 1 },
    { name: 'SkillsProof', maxCount: 1 }
  ]), uploadWorkerDocument);



export default router;
