import express from 'express';
import axios from 'axios';
import geolib from 'geolib';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Function to get latitude and longitude dynamically
const getCoordinates = async (location) => {
    const apiKey = process.env.TOMTOM_API_KEY;
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(location)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
            return response.data.results[0].position;  // { lat, lon }
        }
    } catch (error) {
        console.error("Error fetching location:", error);
    }
    return null;
};

// API to find nearby jobs
router.post('/find-nearby-jobs', async (req, res) => {
    const { workerCity } = req.body;

    if (!workerCity) {
        return res.status(400).json({ error: "Worker city is required" });
    }

    try {
        // Get coordinates for worker city
        const workerCoords = await getCoordinates(workerCity);
        if (!workerCoords) {
            return res.status(400).json({ error: "Invalid worker location" });
        }

        // Fetch jobs from MongoDB using Prisma
        const jobs = await prisma.job.findMany();

        let nearbyJobs = [];

        for (const job of jobs) {
            if (!job.Location) continue;  // Skip if job has no location

            // Convert job location to latitude & longitude
            const jobCoords = await getCoordinates(job.Location);
            if (!jobCoords) continue;

            // Calculate distance
            const distance = geolib.getDistance(
                { latitude: workerCoords.lat, longitude: workerCoords.lon },
                { latitude: jobCoords.lat, longitude: jobCoords.lon }
            ) / 1000;  // Convert meters to km

            if (distance <= 30) {
                nearbyJobs.push({
                    ...job,
                    distance: `${distance.toFixed(2)} km`,
                });
            }
        }

        return res.json({ nearbyJobs });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
