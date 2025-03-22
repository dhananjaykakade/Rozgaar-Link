export type Job = {
    Id: string;
    Title: string;
    Description: string;
    EmployerId: string;
    Location: string;
    Pay: number;
    Skills: string[];
    WorkingHours: string;
    StartDate: string;
    NumberOfWorkers: string;
    AdditionalRequirements?: string;
    Status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
    CreatedAt: string;
    Employer: {
      Name: string;
    };
  };
  