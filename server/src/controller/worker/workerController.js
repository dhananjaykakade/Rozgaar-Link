import prisma from "../../utils/prisma.js";
import ResponseHandler from "../../utils/CustomResponse.js";
import  apiHandler from "../../helpers/ApiHandler.js";

/**
 * Retrieves all workers from the database.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns a list of workers.
 */

export const getWorkers = apiHandler(async (req, res) => {
    // 🔹 Fetch all workers from the database
    const workers = await prisma.worker.findMany();
    
    // 🔹 Return success response
    return ResponseHandler.success(res, 200, "Workers retrieved successfully", workers);
  });


/**
 * Retrieves a worker by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns the worker details.
 */
export const getWorkerById = apiHandler(async (req, res) => {
    const { id } = req.params;
  
    // 🔹 Fetch worker from the database
    const worker = await prisma.worker.findUnique({ where: { Id: id } });
    
    // 🔹 Check if worker exists
    if (!worker) {
      return ResponseHandler.notFound(res, "Worker not found");
    }
    
    // 🔹 Return success response
    return ResponseHandler.success(res, 200, "Worker retrieved successfully", worker);
  });