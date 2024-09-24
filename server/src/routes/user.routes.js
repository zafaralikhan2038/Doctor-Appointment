import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getMyAppointments,
  getSingleUser,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";
import { authenticate, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(authenticate, restrict(["admin"]), getAllUsers);
router
  .route("/:id")
  .get(authenticate, restrict(["patient"]), getSingleUser)
  .put(authenticate, restrict(["patient"]), updateUser)
  .delete(authenticate, restrict(["patient"]), deleteUser);

router
  .route("/profile/me")
  .get(authenticate, restrict(["patient"]), getUserProfile);
router
  .route("/appointments/my-appointments")
  .get(authenticate, restrict(["patient"]), getMyAppointments);

export default router;
