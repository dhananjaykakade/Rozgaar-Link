
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import allJobsReducer from "./slices/allJobsSlice";
import jobsReducer from "./slices/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    jobs: jobsReducer,// ✅ Add authentication slice
    allJobs: allJobsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
