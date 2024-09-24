import { Router } from "express";
import { authenticate, restrict } from "../middlewares/auth.middleware.js";
import { getCheckoutSession } from "../controllers/booking.controller.js";

const router = Router();
router
  .route("/checkout-session/:doctorId")
  .post(authenticate, getCheckoutSession);

export default router;
