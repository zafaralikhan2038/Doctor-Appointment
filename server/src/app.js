import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// import all routes
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import doctorRoute from "./routes/doctor.routes.js";
import reviewRoute from "./routes/review.routes.js";
import bookingRoute from "./routes/booking.routes.js";

// routes declaration
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

export { app };
