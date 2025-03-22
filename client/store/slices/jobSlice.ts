import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  jobsPosted: any[];
  loading: boolean;
}

const initialState: JobState = {
  jobsPosted: [],
  loading: false,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.loading = true;
    },
    fetchJobsSuccess: (state, action: PayloadAction<any[]>) => {
      state.jobsPosted = action.payload; // ✅ Updates state correctly
      state.loading = false;
    },
    fetchJobsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure } = jobsSlice.actions;
export const selectJobPostedState = (state: { jobs: JobState }) => state.jobs; // ✅ Ensure correct selector
export default jobsSlice.reducer;
