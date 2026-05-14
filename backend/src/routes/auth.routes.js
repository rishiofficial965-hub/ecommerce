import { Router } from "express";
import {
  validationRegisterUser,
  validationLoginUser,
} from "../validator/auth.validator.js";
import {
  registerHandler,
  loginHandler,
  googleCallbackHandler,
  verifyOTP,
  sendOTP,
  forgetPassword,
  verifyResetOtp,
  getMe,
  logoutHandler,
  updateProfile,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validationRegisterUser, registerHandler);
router.post("/login", validationLoginUser, loginHandler);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${Config.FRONTEND_URL}/login`,
    session: false,
  }),
  googleCallbackHandler,
);

router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);

router.post("/forget-password", forgetPassword);
router.post("/verify-reset-otp", verifyResetOtp);

router.get("/get-Me", protect, getMe);
router.post("/logout", logoutHandler);
router.patch("/profile", protect, updateProfile);


export default router;
