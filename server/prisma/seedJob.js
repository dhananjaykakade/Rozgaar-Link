import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedJobs() {
  try {
    console.log("Seeding jobs...");

    // Fetch employer IDs
    const employers = await prisma.employer.findMany({ select: { Id: true } });
    if (employers.length === 0) {
      throw new Error("No employers found. Please seed employers first.");
    }

    // Create Jobs
    await prisma.job.createMany({
      data: [
        {
          Title: "Electrician Needed",
          Description: "Looking for an experienced electrician for a home wiring project.",
          EmployerId: employers[0].Id,
          Location: "New York",
          Pay: 500,
          Skills: ["Electrician", "Wiring"],
          WorkingHours: "9 AM - 5 PM",
          StartDate: new Date("2025-03-25T09:00:00Z"),
          NumberOfWorkers: "ONE",
          AdditionalRequirements: "Must have valid license",
        },
        {
          Title: "Plumber Required",
          Description: "Need a plumber to fix bathroom pipelines.",
          EmployerId: employers[1].Id,
          Location: "Los Angeles",
          Pay: 300,
          Skills: ["Plumbing"],
          WorkingHours: "10 AM - 4 PM",
          StartDate: new Date("2025-04-01T10:00:00Z"),
          NumberOfWorkers: "TWO",
        },
        {
          Title: "Landscaper Needed",
          Description: "Looking for a skilled landscaper for a garden makeover.",
          EmployerId: employers[2].Id,
          Location: "Houston",
          Pay: 400,
          Skills: ["Landscaping", "Gardening"],
          WorkingHours: "7 AM - 3 PM",
          StartDate: new Date("2025-04-10T07:00:00Z"),
          NumberOfWorkers: "THREE",
        },
        {
          Title: "Painter for Office",
          Description: "Need a painter to repaint office walls.",
          EmployerId: employers[3].Id,
          Location: "Miami",
          Pay: 350,
          Skills: ["Painting"],
          WorkingHours: "8 AM - 5 PM",
          StartDate: new Date("2025-03-30T08:00:00Z"),
          NumberOfWorkers: "FOUR",
        },
        {
          Title: "Carpenter Required",
          Description: "Looking for a carpenter to build custom furniture.",
          EmployerId: employers[4].Id,
          Location: "Chicago",
          Pay: 600,
          Skills: ["Carpentry"],
          WorkingHours: "10 AM - 6 PM",
          StartDate: new Date("2025-04-05T10:00:00Z"),
          NumberOfWorkers: "FIVE",
        },
      ],
    });

    console.log("Job seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding jobs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedJobs();
