import express from "express";
import {getWorkers,getWorkerById,uploadWorkerDocument,getWorkersWithQuery ,updateWorker,getWorkerDocuments} from "../controller/worker/workerController.js"
const router = express.Router();
import upload from '../utils/multerConfig.js';

// Get all workers
router.get("/workers", getWorkers);

// Get worker documents

router.get("/worker/:id/documents", getWorkerDocuments);
router.put("/worker/:id", updateWorker);
router.get("/worker/:id", getWorkerById);
router.get("/worker/query/or", getWorkersWithQuery);
router.post('/worker/:id', upload.fields([
    { name: 'IdProof', maxCount: 1 },
    { name: 'AddressProof', maxCount: 1 },
    { name: 'SkillsProof', maxCount: 1 }
  ]), uploadWorkerDocument);



export default router;
