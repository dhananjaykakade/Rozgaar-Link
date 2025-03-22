import prisma from "../../utils/prisma.js";
import ResponseHandler from "../../utils/CustomResponse.js";
import  apiHandler from "../../helpers/ApiHandler.js";


export const submitReview = apiHandler(async (req, res) => {
    const { GivenBy, ReceivedBy, Rating, Details, Feedback } = req.body;

    // 🔹 Validate required fields
    if (!GivenBy || !ReceivedBy || !Rating) {
        return ResponseHandler.badRequest(res, "Missing required fields.");
    }

    if (Rating < 0 || Rating > 5) {
        return ResponseHandler.badRequest(res, "Rating must be between 0 and 5.");
    }


        // 🔹 Check if giver and receiver exist
        const giver = await prisma.worker.findUnique({ where: { Id: GivenBy } }) ||
                      await prisma.employer.findUnique({ where: { Id: GivenBy } });
        const receiver = await prisma.worker.findUnique({ where: { Id: ReceivedBy } }) ||
                         await prisma.employer.findUnique({ where: { Id: ReceivedBy } });

        if (!giver || !receiver) {
            return ResponseHandler.notFound(res, "Invalid GivenBy or ReceivedBy ID.");
        }

        // 🔹 Create Review
        const review = await prisma.rating.create({
            data: { GivenBy, ReceivedBy, Rating, Details, Feedback }
        });

        return ResponseHandler.success(res, 201, "Review submitted successfully", review);
});


export const getReviews = apiHandler(async (req, res) => {
    const { id } = req.params;
        const reviews = await prisma.rating.findMany({
            where: { ReceivedBy: id },
            orderBy: { CreatedAt: "desc" }
        });

        return ResponseHandler.success(res, 200, "Reviews retrieved successfully", reviews);

});
