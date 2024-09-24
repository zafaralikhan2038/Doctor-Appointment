import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Doctor } from "../models/doctor.model.js";

const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update user details" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete user account" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    return res.status(200).json({
      success: true,
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve users" });
  }
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "User found", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve user" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "User profile information retrieved successfully",
      data: { ...rest },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user profile information",
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });
    const doctorIds = bookings.map((el) => el.doctor.id);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "Appointments details retrieved successfully",
        data: doctors,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to get user appointments details",
      });
  }
};

export {
  updateUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  getUserProfile,
  getMyAppointments,
};
