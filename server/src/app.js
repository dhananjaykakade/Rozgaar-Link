import express from 'express';
import { httpLogger } from "./utils/logger.js";
import routes from "./routes/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import ResponseHandler from "./utils/CustomResponse.js";
import WorkerRoute from "./routes/worker.route.js";
import EmployerRoute from "./routes/employer.route.js";


const app = express();

// List of allowed origins for CORS. Adjust as needed.
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new CustomError("Not allowed by CORS", 403));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if needed
    optionsSuccessStatus: 204, // Handles preflight requests better
};

// Middleware
app.use(httpLogger); 
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
express.urlencoded({ extended: true })

// Default forbidden route
app.get("/", (_, res) => ResponseHandler.forbidden(res));
app.use("/api", routes);
app.use("/api", WorkerRoute);
app.use("/api", EmployerRoute);


app.use((req, res, next) => {
    next(new CustomError("Route Not Found", 404));
});
app.use(errorMiddleware);

export default app;