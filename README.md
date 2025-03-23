# Rozgaar - Job Matching App

Rozgaar is a **job-matching web app** designed for daily wage workers and job providers. It helps connect skilled workers (such as electricians, carpenters, and plumbers) with employers looking for their services. The platform supports real-time job postings, worker applications, and chat functionality.

## 🚀 Features

### 👨‍🔧 For Workers
- **View Job Listings** based on skills and location
- **Apply for Jobs** with a single click
- **Real-time Chat** with employers
- **Profile Setup** with skill selection and verification
- **Track Job Applications** (Pending/Accepted/Rejected)

### 🏢 For Employers
- **Post Jobs** with required skills, location, and salary
- **Search for Workers** based on skills and availability
- **Manage Job Applications** (Accept/Reject workers)
- **Chat with Workers** in real-time

## 🔧 Tech Stack

| **Technology** | **Usage** |
|--------------|----------|
| **Frontend** | Vite + TypeScript (React) |
| **Backend** | Node.js (Express) |
| **Database** | MongoDB + Prisma ORM |
| **Authentication** | Twilio OTP-based login + JWT |
| **State Management** | Redux Toolkit |
| **File Uploads** | Cloudinary (for Worker Documents) |
| **UI Components** | ShadCN + TailwindCSS |

## 📂 Project Structure
```
Rozgaar/
│── backend/        # Node.js Backend
│── frontend/       # Vite + TypeScript Frontend
│── package.json    # Root package.json to manage both frontend & backend
│── README.md       # Project Documentation
│── .gitignore      # Git Ignore File
```

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/dhananjaykakade/Rozgaar-Link
cd Rozgaar-Link
```

### 2️⃣ Install Dependencies
Use the root `package.json` to install dependencies for both frontend and backend:
```bash
npm run install-all
```

### 3️⃣ Set Up Environment Variables
Create `.env` files for **backend** and **frontend** and add required API keys.

#### Backend `.env`
```env
PORT=4000
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
CLOUDINARY_URL=your_cloudinary_url
```

#### Frontend `.env`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### 4️⃣ Run the Project
Run both frontend and backend concurrently:
```bash
npm run dev
```

---

## 📌 API Endpoints

### 🏗️ **Authentication**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/auth/send-otp` | Sends OTP to a phone number |
| POST | `/auth/verify-otp` | Verifies OTP and returns JWT token |
| POST | `/auth/logout` | Logs out the user |

### 👨‍💼 **Employers**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/employer/job` | Creates a new job posting |
| GET | `/employer/jobs` | Fetches jobs posted by employer |
| PUT | `/employer/job/:id` | Updates job details |
| DELETE | `/employer/job/:id` | Deletes a job |
| GET | `/employer/applicants/:jobId` | Fetches applicants for a job |

### 👷 **Workers**
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/worker/profile/:id` | Fetch worker profile |
| PUT | `/worker/profile/:id` | Update worker profile (excluding documents) |
| POST | `/worker/apply/:jobId` | Apply for a job |
| GET | `/worker/jobs` | Fetch all jobs available |

### 📄 **Document Upload**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/worker/documents` | Upload worker verification documents |

---

## 🔥 Redux Store Setup

### **Auth Slice (`authSlice.ts`)**
```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
```

### **Job Slice (`jobSlice.ts`)**
```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  jobs: any[];
  loading: boolean;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    fetchJobsSuccess: (state, action: PayloadAction<any[]>) => {
      state.jobs = action.payload;
    },
  },
});

export const { fetchJobsSuccess } = jobSlice.actions;
export default jobSlice.reducer;
```

---

## 💡 Future Enhancements
- **Worker ratings and reviews**
- **Multi-language support**
- **Job recommendations based on skills**

---

## 🚀 Hackathon Project by Team Shakham.Inc
- **Prathamesh Ghatmal**
- **Dhananjay Kakade**
- **Siddhi Bodake**
- **Saad Sayyed**

🔥 Built for a 24-hour Hackathon 🚀

**Documentation by - Dhananjay Kakade**

