import express from "express";
import { getAllEmployers,getEmployerById ,getEmployerByQuery,updateEmployer} from "../controller/employer/employerController.js";
const router = express.Router();


router.get("/employers", getAllEmployers);

router.get("/employer/:id", getEmployerById);

router.get("/employer/query/or", getEmployerByQuery);

router.put("/employer/:id", updateEmployer);


export default router;
