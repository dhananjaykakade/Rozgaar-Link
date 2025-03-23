import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Employer {
    Id: string;
    Name: string;
    Number: string;
    CompanyName: string | null;
    ContactPerson: string;
    Email: string | null;
    Website: string | null;
    Address: string;
    City: string;
    Pin: string;
    DescriptionOfWork: string;
    Rating: number;
    CreatedAt: string;
  }
  
  interface Applicant {
    Id: string;
    FirstName: string;
    LastName: string;
    Address: string;
    City: string;
    Number: string;
    Pin: string;
    Availability: string;
    Skills: string[];
    WorkExperience: string | null;
    Education: string | null;
    IsVerified: boolean;
    DocumentsId: string;
    Rating: number;
    CreatedAt: string;
    jobId: string;
  }
  
  interface Job {
    Id: string;
    Title: string;
    Description: string;
    EmployerId: string;
    Employer: Employer;
    Location: string;
    Pay: number;
    Skills: string[];
    WorkingHours: string;
    StartDate: string;
    NumberOfWorkers: string;
    AdditionalRequirements?: string;
    Status: string;
    CreatedAt: string;
    Applicants: Applicant[];
  }

interface AllJobsState {
  allJobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: AllJobsState = {
  allJobs: [],
  loading: false,
  error: null,
};

// ✅ Correct Async Thunk
export const fetchAllJobs = createAsyncThunk("jobs/fetchAllJobs", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:4000/api/jobs");
    return response.data.data; // Ensure API returns jobs inside `data`
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch jobs");
  }
});

// ✅ Fix: Handle Async Thunk inside `extraReducers`
const allJobsSlice = createSlice({
  name: "allJobs",
  initialState,
  reducers: {}, // Removed unused reducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        console.log(action.payload);
        state.allJobs = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAllJobsState = (state: { allJobs: AllJobsState }) => state.allJobs; // ✅ Fix selector

export default allJobsSlice.reducer;
