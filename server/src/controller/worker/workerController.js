import prisma from "../../utils/prisma.js";
import ResponseHandler from "../../utils/CustomResponse.js";
import  apiHandler from "../../helpers/ApiHandler.js";
import fs from 'fs';
import cloudinary from '../../config/cloud.config.js';
import path from "path";


export const generateSignedUrl = (publicId) => {
    const fileExtension = publicId.split('.').pop();
     // 🔹 Extract file extension
    return cloudinary.utils.private_download_url(publicId, fileExtension, {
        resource_type: 'raw',
        type: 'authenticated',
        sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 🔹 1-hour expiry
    });
  };
  

/**
 * Retrieves all workers from the database.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns a list of workers.
 */

export const getWorkers = apiHandler(async (req, res) => {
  const workers = await prisma.worker.findMany();

  // 🔹 Fetch ratings for all workers
  const workerRatings = await prisma.rating.groupBy({
      by: ["ReceivedBy"],
      _avg: { Rating: true },
  });

  // 🔹 Map ratings to workers
  const workersWithAvgRating = workers.map(worker => {
      const ratingData = workerRatings.find(r => r.ReceivedBy === worker.Id);
      const averageRating = ratingData?._avg?.Rating || 0;
      
      return {
          ...worker,
          Rating: parseFloat(averageRating.toFixed(2)), // ✅ Round to 2 decimal places
      };
  });

  return ResponseHandler.success(res, 200, "Workers retrieved successfully", workersWithAvgRating);
  });


/**
 * Retrieves a worker by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns the worker details.
 */


export const getWorkerById = apiHandler(async (req, res) => {
    const { id } = req.params;
    const worker = await prisma.worker.findUnique({
      where: { Id: id },

      include: { Documents: true },
    });
  
    if (!worker) return ResponseHandler.notFound(res, "Worker not found");
    // return full worker
    return ResponseHandler.success(res, 200, "Worker retrieved successfully",worker );
  

  });

/**
 * Retrieves a worker by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns the worker details.
 */

  export const getWorkerDocuments = apiHandler(async (req, res) => {
    const { id } = req.params;
    const worker = await prisma.worker.findUnique({
      where: { Id: id },
      include: { Documents: true },
    });
  
    if (!worker) return ResponseHandler.notFound(res, "Worker not found");
  
    const signedDocuments = {
      IdProof: worker.Documents?.IdProof ? generateSignedUrl(worker.Documents.IdProof) : null,
      AddressProof: worker.Documents?.AddressProof ? generateSignedUrl(worker.Documents.AddressProof) : null,
      SkillsProof: worker.Documents?.SkillsProof ? generateSignedUrl(worker.Documents.SkillsProof) : null,
    };
  
    return ResponseHandler.success(res, 200, "Worker retrieved successfully", { ...worker, Documents: signedDocuments });
  });
  

  /**
 * Uploads a worker's document to Cloudinary.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns the uploaded document URL.
 */


  export const uploadWorkerDocument = apiHandler(async (req, res) => {
    const { id } = req.params;
    const worker = await prisma.worker.findUnique({ where: { Id: id } });
  
    if (!worker) {
      return ResponseHandler.notFound(res, '❌ Worker not found');
    }
  
    console.log("➡️ Uploaded Files:", req.files);
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return ResponseHandler.badRequest(res, '❌ No files uploaded');
    }
  
    const documentUrls = {};
  
    // Function to rename and upload file
    const renameAndUpload = async (file, docType) => {
      return new Promise((resolve, reject) => {
        try {
          const userNumber = worker.Number?.toString() || 'unknown'; // Ensure Number is a string
          const newFileName = `${userNumber}_${docType}${path.extname(file.originalname)}`;
          const newFilePath = path.join('./uploads', newFileName);
  
          // Rename file before upload
          fs.rename(file.path, newFilePath, async (err) => {
            if (err) {
              console.error("❌ Rename Error:", err);
              return reject(err);
            }
  
            console.log(`✅ File renamed to: ${newFileName}`, newFilePath);
  
            // Upload to Cloudinary
            cloudinary.uploader.upload(
              newFilePath,
              {
                folder: 'worker_documents',
                resource_type: 'raw', // ✅ Use 'raw' for PDFs, instead of 'auto'
                type: 'authenticated', // ✅ Ensures private access
              },
              (error, result) => {
                if (error) {
                  console.error("❌ Cloudinary Upload Error:", error);
                  return reject(error);
                }
  
                console.log(`✅ Uploaded to Cloudinary secure url : ${result.secure_url}`);
  
                // Delete local file after successful upload
                fs.unlink(newFilePath, (unlinkErr) => {
                  if (unlinkErr) console.error("⚠️ Failed to delete local file:", unlinkErr);
                });
                console.log(`✅ Uploaded to Cloudinary public id: ${result.public_id}`);
                resolve(result.public_id); // ✅ Store only public_id, not direct URL
              }
            );
          });
        } catch (error) {
          console.error("❌ Unexpected Error:", error);
          reject(error);
        }
      });
    };
  
    // 🔹 Upload documents if provided
    if (req.files.IdProof) {
      documentUrls.IdProof = await renameAndUpload(req.files.IdProof[0], "IdProof");
    }
    if (req.files.AddressProof) {
      documentUrls.AddressProof = await renameAndUpload(req.files.AddressProof[0], "AddressProof");
    }
    if (req.files.SkillsProof) {
      documentUrls.SkillsProof = await renameAndUpload(req.files.SkillsProof[0], "SkillsProof");
    }
  
    // 🔹 Update worker's documents in the database
    const updatedWorker = await prisma.worker.update({
        where: { Id: id },
        data: {
          Documents: {
            upsert: {
              create: documentUrls, // ✅ Create if doesn't exist
              update: documentUrls, // ✅ Update if exists
            },
          },
        },
        include: { Documents: true },
      });
  
    console.log(updatedWorker);
  
    return ResponseHandler.success(res, 200, '✅ Documents uploaded successfully', updatedWorker);
  });
  



  /**
 * Retrieves a list of workers based on optional query parameters.
 * @param {Request} req - The request object containing query parameters.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Returns a list of workers with filtered data.
 *
 * Query Parameters:
 * - `city` (string): Filter workers by city.
 * - `skill` (string): Filter workers by specific skill.
 * - `availability` (string): Filter workers by availability status.
 */
  export const getWorkersWithQuery = apiHandler(async (req, res) => {
      console.log("➡️ Query Parameters:", req.query);
    const { city, skill, availability } = req.query;


    // Define filters object
    const filters = {};
    if (city) filters.City = { equals: city };  
    if (skill) filters.Skills = { has: skill };  
    if (availability) filters.Availability = { equals: availability };

    try {
        const workers = await prisma.worker.findMany({  // ✅ Ensure `findMany()` is used
            where: filters,
            select: {
                Id: true,
                FirstName: true,
                LastName: true,
                City: true,
                Availability: true,
                Skills: true,
                Rating: true,
                CreatedAt: true,
            },
        });

        return ResponseHandler.success(res, 200, "Workers retrieved successfully", workers);
    } catch (error) {
        console.error("❌ Prisma Query Error:", error);
        return ResponseHandler.serverError(res, "Error fetching workers");
    }
});
  