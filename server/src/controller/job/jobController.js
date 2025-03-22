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
                Employer: { select: { Name: true, CompanyName: true } },
                Applicants: { select: { Id: true, FirstName: true, LastName: true, Skills: true } }
            }
        });

        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        return ResponseHandler.success(res, 200, "Job retrieved successfully", job);
});



export const applyForJob = apiHandler(async (req, res) => {
    const { id } = req.params; // Job ID
    const { WorkerId } = req.body; // Worker ID from request
        // 🔹 Check if job exists
        const job = await prisma.job.findUnique({ where: { Id: id } });
        if (!job) {
            return ResponseHandler.notFound(res, "Job not found.");
        }

        // 🔹 Check if worker exists
        const worker = await prisma.worker.findUnique({ where: { Id: WorkerId } });
        if (!worker) {
            return ResponseHandler.notFound(res, "Worker not found.");
        }

        // 🔹 Check if worker has already applied
        const alreadyApplied = await prisma.job.findFirst({
            where: {
                Id: id,
                Applicants: { some: { Id: WorkerId } }
            }
        });

        if (alreadyApplied) {
            return ResponseHandler.conflict(res, "Worker has already applied for this job.");
        }

        // 🔹 Add worker to job's Applicants list
        const updatedJob = await prisma.job.update({
            where: { Id: id },
            data: {
                Applicants: { connect: { Id: WorkerId } }
            },
            include: { Applicants: true }
        });

        return ResponseHandler.success(res, 200, "Worker applied successfully", updatedJob);

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
