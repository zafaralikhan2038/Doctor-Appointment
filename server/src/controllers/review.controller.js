import { Review } from "../models/review.model.js";
import { Doctor } from "../models/doctor.model.js";

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    if (!reviews) {
      return res.status(404).json({ message: "Reviews not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Reviews found successfully",
      data: reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get reviews" });
  }
};

const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.id;
  if (!req.body.user) req.body.user = req.id;

  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();
    
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit review" });
  }
};

export { getAllReviews, createReview };
