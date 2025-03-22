import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

(async function updateWorkerRatings() {
    const workers = await prisma.worker.findMany();
    const Employer = await prisma.Employer.findMany();
  
    for (const worker of workers) {
      const ratings = await prisma.rating.findMany({
        where: { ReceivedBy: worker.Id },
      });
  
      if (ratings.length > 0) {
        const avgRating =
          ratings.reduce((sum, r) => sum + r.Rating, 0) / ratings.length;
        await prisma.worker.update({
          where: { Id: worker.Id },
          data: { Rating: avgRating },
        });
      }
    }

    for (const employer of Employer) {
      const ratings = await prisma.rating.findMany({
        where: { ReceivedBy: employer.Id },
      });
  
      if (ratings.length > 0) {
        const avgRating =
          ratings.reduce((sum, r) => sum + r.Rating, 0) / ratings.length;
        await prisma.Employer.update({
          where: { Id: employer.Id },
          data: { Rating: avgRating },
        });
      }
    }
    await prisma.$disconnect();
    console.log("Worker and employer ratings updated successfully!");

  })()