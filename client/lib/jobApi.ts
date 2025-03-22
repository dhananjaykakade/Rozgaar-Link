import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/job"; // Change if needed

export const createJobApi = async (jobData: {
  Title: string;
  Description: string;
  EmployerId: string;
  Location: string;
  Pay: number;
  Skills: string[];
  WorkingHours: string;
  StartDate: string;
  NumberOfWorkers: string; // Enum: ONE, TWO, THREE, etc.
  AdditionalRequirements?: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, jobData, {

    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating job:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 🔹 Function to Handle Job Posting
export const handlePostJob = async (
  formData: any,
  user: any,
  skills: string[],
  setSubmitting: (value: boolean) => void,
  toast: any,
  router: any
) => {
  try {
    setSubmitting(true);

    const jobData = {
      Title: formData.Title,
      Description: formData.Description,
      EmployerId: user.Id, // Get Employer ID from Redux
      Location: formData.Location,
      Pay: Number(formData.Pay),
      Skills: skills,
      WorkingHours: formData.WorkingHours,
      StartDate: formData.StartDate,
      NumberOfWorkers: formData.NumberOfWorkers,
      AdditionalRequirements: formData.AdditionalRequirements || undefined,
    };

    await createJobApi(jobData);

    toast({
      title: "✅ Job Posted Successfully",
      description: "Your job listing has been created.",
    });

    router.push("/employer/dashboard"); // Redirect to dashboard
  } catch (error) {
    toast({
      title: "❌ Job Posting Failed",
      description: error || "An error occurred while posting the job.",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};