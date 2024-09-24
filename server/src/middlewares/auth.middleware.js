import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers?.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded._id;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/*
export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  } else if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    return res
      .status(403)
      .json({ success: false, message: "You are not authorized" });
  }

  next();
};
*/

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  } else if (doctor) {
    user = doctor;
  }

  // Check if user was found
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found" });
  }

  // Check if the user's role is allowed
  if (!roles.includes(user.role)) {
    return res
      .status(403)
      .json({ success: false, message: "You are not authorized" });
  }

  next();
};
