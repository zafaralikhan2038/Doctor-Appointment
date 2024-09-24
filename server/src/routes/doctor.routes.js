import { Router } from "express";
import {
  deleteDoctor,
  getAllDoctors,
  getDoctorProfile,
  getSingleDoctor,
  updateDoctor,
} from "../controllers/doctor.controller.js";
import { authenticate, restrict } from "../middlewares/auth.middleware.js";
import reviewRoute from "./review.routes.js";

const router = Router();

// nested route
router.use("/:id/reviews", reviewRoute);

// router.route("/").get(authenticate, restrict(["admin"]), getAllDoctors);
router.route("/").get(getAllDoctors);
router.route("/:id").get(getSingleDoctor);
router
  .route("/:id")
  .get(authenticate, restrict(["doctor"]), getSingleDoctor)
  .put(authenticate, restrict(["doctor"]), updateDoctor)
  .delete(authenticate, restrict(["doctor"]), deleteDoctor);

router
  .route("/profile/me")
  .get(authenticate, restrict(["doctor"]), getDoctorProfile);

export default router;
