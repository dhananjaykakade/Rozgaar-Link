import prisma from "../../utils/prisma.js";
import ResponseHandler from "../../utils/CustomResponse.js";
import  apiHandler from "../../helpers/ApiHandler.js";


/**
 * @route GET /api/employers
 * @description Get all employers
 * @returns {Array} List of employers
 */

export const getAllEmployers = apiHandler(async (req, res) => {
        const employers = await prisma.employer.findMany({
            select: {
                Id: true,
                Name: true,
                Number: true,
                CompanyName: true,
                ContactPerson: true,
                Email: true,
                Website: true,
                City: true,
                DescriptionOfWork: true,
                Rating: true,
                CreatedAt: true
            },
        });

        return ResponseHandler.success(res, 200, "Employers retrieved successfully", employers);
    
});



export const getEmployerById = apiHandler(async (req, res) => {
    const { id } = req.params;

        const employer = await prisma.employer.findUnique({
            where: { Id: id },
            select: {
                Id: true,
                Name: true,
                Number: true,
                CompanyName: true,
                ContactPerson: true,
                Email: true,
                Website: true,
                City: true,
                DescriptionOfWork: true,
                Rating: true,
                CreatedAt: true
            },
        });

        if (!employer) return ResponseHandler.notFound(res, "Employer not found");

        return ResponseHandler.success(res, 200, "Employer retrieved successfully", employer);
  
});


export const getEmployerByQuery = apiHandler(async (req, res) => {
    const { city, companyName } = req.query;

    const filters = {};
    if (city) filters.City = { equals: city };
    if (companyName) filters.CompanyName = { equals: companyName };
        const employer = await prisma.employer.findFirst({
            where: filters,
            select: {
                Id: true,
                Name: true,
                Number: true,
                CompanyName: true,
                ContactPerson: true,
                Email: true,
                Website: true,
                City: true,
                DescriptionOfWork: true,
                Rating: true,
                CreatedAt: true
            },
        });

        if (!employer) return ResponseHandler.notFound(res, "Employer not found");

        return ResponseHandler.success(res, 200, "Employer retrieved successfully", employer);
});


export const updateEmployer = apiHandler(async (req, res) => {
    const { id } = req.params;
    const { Name, CompanyName, ContactPerson, Email, Website, Address, City, Pin, DescriptionOfWork } = req.body;

        const employer = await prisma.employer.update({
            where: { Id: id },
            data: {
                Name,
                CompanyName,
                ContactPerson,
                Email,
                Website,
                Address,
                City,
                Pin,
                DescriptionOfWork
            },
        });

        return ResponseHandler.success(res, 200, "Employer updated successfully", employer);
});
