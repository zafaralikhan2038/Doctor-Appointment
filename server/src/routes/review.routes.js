import { Router } from "express";
import {
  createReview,
  getAllReviews,
} from "../controllers/review.controller.js";
import { authenticate, restrict } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, restrict(["patient"]), createReview);

export default router;
