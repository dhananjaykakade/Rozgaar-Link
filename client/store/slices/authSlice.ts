"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

// ✅ Function to check if the token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Check if expired
  } catch (error) {
    return true; // Invalid token
  }
};

// ✅ Define Auth State
interface AuthState {
  user: any | null; // Supports both Worker & Employer
  role: string;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  role: "",
};

// ✅ Restore session from localStorage (Handles Expired Tokens)
const loadAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return { ...initialState };
    }

    return {
      user: user ? JSON.parse(user) : null,
      token,
      loading: false,
      role: JSON.parse(user || "{}").role || "",
    };
  }
  return initialState;
};

// ✅ Create Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(), // Load persisted session
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string; role: string }>) => {
      console.log("Auth success", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.loading = false;

      // ✅ Store in localStorage
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.role = "";

      // ✅ Remove from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      
    },
  },
});

// ✅ Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;

export const { loginStart, loginSuccess, logout,updateProfile  } = authSlice.actions;

export default authSlice.reducer;
