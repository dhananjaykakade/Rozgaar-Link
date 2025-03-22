

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Seeding database...");

    // Create Employers
    const employers = await prisma.employer.createMany({
      data: [
        { Name: "John Constructions", Phone: "1234567890", ContactPerson: "John Doe", Address: "NY, USA", City: "New York", Pin: "10001", DescriptionOfWork: "Construction projects" },
        { Name: "Tech Solutions", Phone: "9876543210", ContactPerson: "Jane Smith", Address: "LA, USA", City: "Los Angeles", Pin: "90001", DescriptionOfWork: "Software Development" },
        { Name: "Green Landscaping", Phone: "4561237890", ContactPerson: "Mike Green", Address: "TX, USA", City: "Houston", Pin: "77001", DescriptionOfWork: "Landscaping and Gardening" },
        { Name: "AutoFix Repairs", Phone: "7418529630", ContactPerson: "Sarah Connor", Address: "FL, USA", City: "Miami", Pin: "33101", DescriptionOfWork: "Car Repairs" },
        { Name: "BluePrint Architects", Phone: "3692581470", ContactPerson: "Robert Langdon", Address: "IL, USA", City: "Chicago", Pin: "60601", DescriptionOfWork: "Architectural Planning" },
      ],
    });
    
    const employerIds = await prisma.employer.findMany({ select: { Id: true } });

    // Create Workers
    const workers = await prisma.worker.createMany({
      data: [
        { FirstName: "Alex", LastName: "Brown", Address: "TX, USA", City: "Houston", Pin: "77001", Availability: "IMMEDIATE", Skills: ["Plumbing", "Carpentry"] },
        { FirstName: "Maria", LastName: "Lopez", Address: "FL, USA", City: "Miami", Pin: "33101", Availability: "WITHIN_ONE_WEEK", Skills: ["Electrician"] },
        { FirstName: "David", LastName: "Wilson", Address: "IL, USA", City: "Chicago", Pin: "60601", Availability: "WITHIN_TWO_WEEKS", Skills: ["Landscaping"] },
        { FirstName: "Sophia", LastName: "Miller", Address: "CA, USA", City: "San Francisco", Pin: "94101", Availability: "WITHIN_A_MONTH", Skills: ["Masonry"] },
        { FirstName: "James", LastName: "Anderson", Address: "NY, USA", City: "New York", Pin: "10001", Availability: "IMMEDIATE", Skills: ["Painting", "Tiling"] },
      ],
    });
    
    const workerIds = await prisma.worker.findMany({ select: { Id: true } });

    // Create Ratings
    await prisma.rating.createMany({
      data: [
        { GivenBy: workerIds[0].Id, ReceivedBy: employerIds[0].Id, Rating: 4.5, Review: "Good work experience" },
        { GivenBy: employerIds[1].Id, ReceivedBy: workerIds[1].Id, Rating: 5.0, Review: "Excellent job done!" },
        { GivenBy: workerIds[2].Id, ReceivedBy: employerIds[2].Id, Rating: 3.8, Review: "Fair experience" },
        { GivenBy: employerIds[3].Id, ReceivedBy: workerIds[3].Id, Rating: 4.2, Review: "Skilled worker" },
        { GivenBy: workerIds[4].Id, ReceivedBy: employerIds[4].Id, Rating: 4.9, Review: "Highly recommended" },
      ],
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
