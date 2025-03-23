import prisma from "../../utils/prisma.js";
import ResponseHandler from "../../utils/CustomResponse.js";
import  apiHandler from "../../helpers/ApiHandler.js";



export const createJob = apiHandler(async (req, res) => {
    const { Title, Description, EmployerId, Location, Pay, Skills, WorkingHours, StartDate, NumberOfWorkers, AdditionalRequirements } = req.body;

    // 🔹 Validate required fields
    if (!Title || !Description || !EmployerId || !Location || !Pay || !Skills || !WorkingHours || !StartDate || !NumberOfWorkers) {
        return ResponseHandler.badRequest(res, "Missing required fields.");
    }

    // 🔹 Ensure employer exists
    const employer = await prisma.employer.findUnique({ where: { Id: EmployerId } });
    if (!employer) {
        return ResponseHandler.notFound(res, "Employer not found.");
    }


        // 🔹 Create Job in DB
        const job = await prisma.job.create({
            data: {
                Title,
                Description,
                EmployerId,
                Location,
                Pay,
                Skills,
                WorkingHours,
                StartDate: new Date(StartDate),
                NumberOfWorkers,
                AdditionalRequirements,
            },
        });

        return ResponseHandler.success(res, 201, "Job posted successfully", job);

});


export const getAllJobs = apiHandler(async (req, res) => {
        const jobs = await prisma.job.findMany({
            include: {
                Employer: true, // Fetch employer details
            },
        });

        return ResponseHandler.success(res, 200, "Jobs retrieved successfully", jobs);
});


export const updateJob = apiHandler(async (req, res) => {
    const { id } = req.params;
    const { Title, Description, Location, Pay, Skills, WorkingHours, StartDate, NumberOfWorkers, AdditionalRequirements, Status } = req.body;

        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({ where: { Id: id } });
        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        // 🔹 Update job details
        const updatedJob = await prisma.job.update({
            where: { Id: id },
            data: {
                Title,
                Description,
                Location,
                Pay,
                Skills,
                WorkingHours,
                StartDate: StartDate ? new Date(StartDate) : undefined,
                NumberOfWorkers,
                AdditionalRequirements,
                Status,
            },
        });

        return ResponseHandler.success(res, 200, "Job updated successfully", updatedJob);

});


export const deleteJob = apiHandler(async (req, res) => {
    const { id } = req.params;
        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({ where: { Id: id } });
        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        // 🔹 Delete job
        await prisma.job.delete({ where: { Id: id } });

        return ResponseHandler.success(res, 200, "Job deleted successfully");

});

export const getJobsByQuery = apiHandler(async (req, res) => {
    const { city, skills, status } = req.query;

    const filters = {};
    if (city) filters.Location = { equals: city };
    if (skills) filters.Skills = { has: skills };
    if (status) filters.Status = { equals: status };

    

        const jobs = await prisma.job.findMany({
            where: filters,
            include: {
                Employer: { select: { Name: true, CompanyName: true } }
            }
        });

        return ResponseHandler.success(res, 200, "Jobs retrieved successfully", jobs);

});




export const updateJobStatus = apiHandler(async (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;

    // 🔹 Validate status
    if (!Status || !["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"].includes(Status)) {
        return ResponseHandler.badRequest(res, "Invalid job status.");
    }
        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({ where: { Id: id } });
        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        // 🔹 Update only the status field
        const updatedJob = await prisma.job.update({
            where: { Id: id },
            data: { Status },
        });

        return ResponseHandler.success(res, 200, "Job status updated successfully", updatedJob);

});


export const getJobById = apiHandler(async (req, res) => {
    const { id } = req.params;


        // 🔹 Fetch job with employer details
        const job = await prisma.job.findUnique({
            where: { Id: id },
            include: {
                Employer: true,
                Applicants: true, }
            
        });

        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        return ResponseHandler.success(res, 200, "Job retrieved successfully", job);
});



export const applyForJob = apiHandler(async (req, res) => {
    const { id } = req.params; // Job ID
    const { WorkerId } = req.body; // Worker ID


        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({ where: { Id: id } });
        if (!job) return ResponseHandler.notFound(res, "Job not found.");

        // 🔹 Check if worker exists
        const worker = await prisma.worker.findUnique({ where: { Id: WorkerId } });
        if (!worker) return ResponseHandler.notFound(res, "Worker not found.");

        // 🔹 Check if worker already applied
        const existingApplication = await prisma.jobApplication.findFirst({
            where: { JobId: id, WorkerId: WorkerId }
        });

        if (existingApplication) {
            return ResponseHandler.conflict(res, "Worker has already applied for this job.");
        }

        // 🔹 Create new job application (default status: PENDING)
        const jobApplication = await prisma.jobApplication.create({
            data: { JobId: id, WorkerId: WorkerId }
        });

        return ResponseHandler.success(res, 200, "Worker applied successfully", jobApplication);
});



export const getJobApplicants = apiHandler(async (req, res) => {
    const { id } = req.params;
        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({
            where: { Id: id },
            include: {
                Applicants: {
                    select: { Id: true, FirstName: true, LastName: true, Skills: true, Availability: true }
                }
            }
        });

        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        return ResponseHandler.success(res, 200, "Applicants retrieved successfully", job.Applicants);

});


export const getEmployerJobApplications = apiHandler(async (req, res) => {
    const { id } = req.params; // Employer ID
        // 🔹 Fetch all jobs posted by this employer
        const jobs = await prisma.job.findMany({
            where: { EmployerId: id },
            select: {
                Id: true,
                Title: true,
                JobApplications: {
                    include: {
                        Worker: { select: { Id: true, FirstName: true, LastName: true, Skills: true } }
                    }
                }
            }
        });

        return ResponseHandler.success(res, 200, "Job applications retrieved successfully", jobs);

});

export const getWorkerApplications = apiHandler(async (req, res) => {
    const { id } = req.params; // Worker ID

        // 🔹 Check if worker exists
        const worker = await prisma.worker.findUnique({ where: { Id: id } });
        if (!worker) {
            return ResponseHandler.notFound(res, "Worker not found.");
        }

        // 🔹 Fetch all jobs the worker applied for
        const applications = await prisma.jobApplication.findMany({
            where: { WorkerId: id },
            include: {
                Job: {
                    select: { Id: true, Title: true, Description: true, Employer: { select: { Name: true } } }
                }
            }
        });

        return ResponseHandler.success(res, 200, "Worker job applications retrieved successfully", applications);

});


export const updateApplicationStatus = apiHandler(async (req, res) => {
    const { jobId, workerId } = req.params;
    const { Status } = req.body; // New status

    // 🔹 Validate status
    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(Status)) {
        return ResponseHandler.badRequest(res, "Invalid application status.");
    }

        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({ where: { Id: jobId } });
        if (!job) return ResponseHandler.notFound(res, "Job not found.");

        // 🔹 Check if worker exists
        const worker = await prisma.worker.findUnique({ where: { Id: workerId } });
        if (!worker) return ResponseHandler.notFound(res, "Worker not found.");

        console.log(jobId)
        // 🔹 Check if application exists

        const application = await prisma.jobApplication.findFirst({
            where: { JobId: jobId, WorkerId: workerId }
        });

        if (!application) {
            return ResponseHandler.notFound(res, "Application not found.");
        }

        // 🔹 Update application status
        const updatedApplication = await prisma.jobApplication.updateMany({
            where: { JobId: jobId, WorkerId: workerId },
            data: { Status }
        });

        return ResponseHandler.success(res, 200, "Application status updated successfully", updatedApplication);
    })

    // create route to get job application posted by single user 
    export const getAllJobsBySingleUser = apiHandler(async (req,res) => {
        const { id } = req.params; // User ID
        // �� Fetch all jobs posted by this user follow below data structure
        // {
        //     "_id": {
        //       "$oid": "67deb38dac87083c469208fc"
        //     },
        //     "Title": "Electrician Needed",
        //     "Description": "Looking for an experienced electrician for a home wiring project.",
        //     "EmployerId": {
        //       "$oid": "67de8f6145cdb206f77da214"
        //     },
        //     "Location": "New York",
        //     "Pay": 500,
        //     "Skills": [
        //       "Electrician",
        //       "Wiring"
        //     ],
        //     "WorkingHours": "9 AM - 5 PM",
        //     "StartDate": {
        //       "$date": "2025-03-25T09:00:00.000Z"
        //     },
        //     "NumberOfWorkers": "ONE",
        //     "AdditionalRequirements": "Must have valid license",
        //     "Status": "ACTIVE",
        //     "CreatedAt": {
        //       "$date": "2025-03-22T12:56:45.108Z"
        //     }
        //   }
        const jobs = await prisma.job.findMany({
            where: { EmployerId: id },
            select: {
                Id: true,
                Title: true,
                Description: true,
                EmployerId: true,
                Location: true,
                Pay: true,
                Skills: true,
                WorkingHours: true,
                StartDate: true,
                NumberOfWorkers: true,
                AdditionalRequirements: true,
                Status: true,
                CreatedAt: true,
                Employer: { select: { Name: true } }
            }
        });
        return ResponseHandler.success(res, 200, "Jobs retrieved successfully", jobs);

      
    })

