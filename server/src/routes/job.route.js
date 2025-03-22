import express from "express";
import { createJob,getAllJobs,updateJob,deleteJob,getJobsByQuery ,updateJobStatus,getJobById,applyForJob ,getJobApplicants } from "../controller/job/jobController.js";
const router = express.Router();

router.post("/job", createJob);

router.get("/jobs", getAllJobs);

router.put("/job/:id", updateJob);

router.delete("/job/:id", deleteJob);

router.get("/job/query/or", getJobsByQuery);

router.put("/job/:id/status", updateJobStatus);

router.get("/job/:id", getJobById);

router.post("/job/:id/apply", applyForJob);

router.get("/job/:id/applicants", getJobApplicants);



export default router;
