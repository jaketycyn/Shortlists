import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  updateUser,
  findUser,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.route("/register").post(apiLimiter, registerUser);
router.route("/login").post(apiLimiter, loginUser);
router.route("/updateuser").patch(authenticateUser, updateUser);
//:userIdentifier is email for now will be username or profile in future
router.route("/finduser/:userIdentifier").get(authenticateUser, findUser);

export default router;
