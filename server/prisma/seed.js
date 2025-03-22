import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Create Employers
    const employer1 = await prisma.employer.create({
        data: {
            Name: "Tech Corp",
            Number: "9876543210",
            CompanyName: "Tech Corp Pvt Ltd",
            ContactPerson: "John Doe",
            Email: "john@techcorp.com",
            Website: "https://techcorp.com",
            Address: "123 Tech Street",
            City: "New York",
            Pin: "10001",
            DescriptionOfWork: "Software development and IT solutions",
            Rating: 4.5,
        },
    });

    const employer2 = await prisma.employer.create({
        data: {
            Name: "BuildX",
            Number: "8888888888",
            CompanyName: "BuildX Constructions",
            ContactPerson: "Jane Smith",
            Email: "jane@buildx.com",
            Website: "https://buildx.com",
            Address: "456 Builder Lane",
            City: "Mumbai",
            Pin: "400001",
            DescriptionOfWork: "Construction and real estate",
            Rating: 4.2,
        },
    });

    // Create Workers
    const worker1 = await prisma.worker.create({
        data: {
            FirstName: "Alice",
            LastName: "Smith",
            Address: "456 Worker Lane",
            City: "Los Angeles",
            Number: "1234567890",
            Pin: "90001",
            Availability: "IMMEDIATE",
            Skills: ["Plumbing", "Carpentry"],
            WorkExperience: "5 years",
            Education: "High School Diploma",
            IsVerified: true,
            Rating: 4.2,
        },
    });

    const worker2 = await prisma.worker.create({
        data: {
            FirstName: "Rajesh",
            LastName: "Kumar",
            Address: "678 Main Road",
            City: "Pune",
            Number: "9876543211",
            Pin: "411001",
            Availability: "WITHIN_ONE_WEEK",
            Skills: ["Electrician", "House Wiring"],
            WorkExperience: "6 years",
            Education: "Diploma in Electrical",
            IsVerified: true,
            Rating: 4.5,
        },
    });

    const worker3 = await prisma.worker.create({
        data: {
            FirstName: "Amit",
            LastName: "Verma",
            Address: "789 Green Park",
            City: "Mumbai",
            Number: "9876543212",
            Pin: "400002",
            Availability: "WITHIN_TWO_WEEKS",
            Skills: ["Mason", "Construction"],
            WorkExperience: "7 years",
            Education: "ITI in Masonry",
            IsVerified: true,
            Rating: 4.0,
        },
    });

    const worker4 = await prisma.worker.create({
        data: {
            FirstName: "Sneha",
            LastName: "Sharma",
            Address: "55 Tech Street",
            City: "Bangalore",
            Number: "9876543213",
            Pin: "560001",
            Availability: "IMMEDIATE",
            Skills: ["Software Development", "ReactJS"],
            WorkExperience: "3 years",
            Education: "B.Tech in CS",
            IsVerified: true,
            Rating: 4.8,
        },
    });

    // Create Jobs
    const job1 = await prisma.job.create({
        data: {
            Title: "Electrician Needed",
            Description: "Looking for an experienced electrician.",
            EmployerId: employer1.Id,
            Location: "Pune",  // ✅ Matches worker in Pune
            Pay: 25.0,
            Skills: ["Wiring", "Circuit Repair"],
            WorkingHours: "9 AM - 5 PM",
            StartDate: new Date(),
            NumberOfWorkers: "TWO",
            Status: "ACTIVE",
        },
    });

    const job2 = await prisma.job.create({
        data: {
            Title: "Construction Worker Needed",
            Description: "Need experienced mason and laborers.",
            EmployerId: employer2.Id,
            Location: "Mumbai",  // ✅ Matches worker in Mumbai
            Pay: 30.0,
            Skills: ["Masonry", "Concrete Work"],
            WorkingHours: "8 AM - 4 PM",
            StartDate: new Date(),
            NumberOfWorkers: "FIVE",
            Status: "ACTIVE",
        },
    });

    const job3 = await prisma.job.create({
        data: {
            Title: "Software Developer",
            Description: "Looking for a ReactJS developer.",
            EmployerId: employer1.Id,
            Location: "Bangalore",  // ✅ Matches worker in Bangalore
            Pay: 50.0,
            Skills: ["ReactJS", "Node.js"],
            WorkingHours: "10 AM - 6 PM",
            StartDate: new Date(),
            NumberOfWorkers: "ONE",
            Status: "ACTIVE",
        },
    });

    const job4 = await prisma.job.create({
        data: {
            Title: "Plumber Needed",
            Description: "Looking for a skilled plumber.",
            EmployerId: employer1.Id,
            Location: "Delhi",  // ❌ No workers in Delhi
            Pay: 20.0,
            Skills: ["Pipe Fitting", "Repair"],
            WorkingHours: "9 AM - 5 PM",
            StartDate: new Date(),
            NumberOfWorkers: "TWO",
            Status: "ACTIVE",
        },
    });

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
