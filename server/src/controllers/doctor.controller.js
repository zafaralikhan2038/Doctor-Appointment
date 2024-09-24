import { Doctor } from "../models/doctor.model.js";
import { Booking } from "../models/booking.model.js";

const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor details updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update doctor details" });
  }
};

const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Doctor account deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete doctor account" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    if (doctors.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No doctors found" });
    }
    return res.status(200).json({
      success: true,
      message: "Doctors found successfully",
      data: doctors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve doctors" });
  }
};

const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).select("-password");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Doctor found", data: doctor });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve doctor" });
  }
};

const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;

    return res.status(200).json({
      success: true,
      message: "Doctor profile information retrieved successfully",
      data: { ...rest },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get doctor profile information",
    });
  }
};


export {
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getSingleDoctor,
  getDoctorProfile,
};
