import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";

/*
const register = async (req, res) => {
  const { name, email, password, role, photo, gender } = req.body;
  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (role === "patient") {
      user = await User.create({
        name,
        email,
        password,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = await Doctor.create({
        name,
        email,
        password,
        photo,
        gender,
        role,
      });
    }

    let createdUser = null;
    if (role === "patient") {
      createdUser = await User.findById(user._id).select("-password");
    } else if (role === "doctor") {
      createdUser = await Doctor.findById(user._id).select("-password");
    }

    if (!createdUser) {
      return res
        .status(409)
        .json({
          message: "Something went wrong while user registration, Try again",
        });
    }

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      createdUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again",
    });
  }
};
*/

const register = async (req, res) => {
  const { name, email, password, role, photo, gender } = req.body;
  try {
    let user = null;

    if (role === "patient" || role === "admin") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (role === "patient" || role === "admin") {
      user = await User.create({
        name,
        email,
        password,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = await Doctor.create({
        name,
        email,
        password,
        photo,
        gender,
        role,
      });
    }

    let createdUser = null;
    if (role === "patient" || role === "admin") {
      createdUser = await User.findById(user._id).select("-password");
    } else if (role === "doctor") {
      createdUser = await Doctor.findById(user._id).select("-password");
    }

    if (!createdUser) {
      return res.status(409).json({
        message: "Something went wrong while user registration, Try again",
      });
    }

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      createdUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again",
    });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) user = patient;
    if (doctor) user = doctor;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = user.generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again",
    });
  }
};

export { register, login };
